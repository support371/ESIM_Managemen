import { createClientFromRequest } from "npm:@base44/sdk";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const REVIEW_ACTIONS = new Set(["approve", "reject"]);

const cleanNote = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 1000) : "";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const actor = await base44.auth.me();
    if (!actor || !ADMIN_ROLES.has(actor.role)) {
      return Response.json({ error: "Administrator access is required" }, { status: 403 });
    }

    const { orderId, action, esimId, adminNote } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }
    if (!REVIEW_ACTIONS.has(action) && action !== "assign") {
      return Response.json({ error: "Unsupported request action" }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) return Response.json({ error: "Request not found" }, { status: 404 });
    const customer = order.userId
      ? await base44.asServiceRole.entities.User.get(order.userId)
      : null;
    const customerEmail = order.userEmail || customer?.email;
    if (!customerEmail) {
      return Response.json({ error: "The customer account has no usable email address" }, { status: 409 });
    }

    const note = cleanNote(adminNote);
    const actorName = actor.full_name || actor.email || "Administrator";

    if (action === "approve" || action === "reject") {
      if (!["pending", "pending_review", "pending_approval", "processing", "approved"].includes(order.status)) {
        return Response.json({ error: `A ${order.status} request cannot be ${action}d` }, { status: 409 });
      }

      const status = action === "approve" ? "approved" : "rejected";
      const updated = await base44.asServiceRole.entities.Order.update(order.id, {
        status,
        userEmail: customerEmail,
        adminNote: note,
      });
      await base44.asServiceRole.entities.AuditLog.create({
        userId: actor.id,
        userName: actorName,
        action: action === "approve" ? "APPROVE" : "REJECT",
        entityType: "Order",
        entityId: order.id,
        description: `${action === "approve" ? "Approved" : "Rejected"} eSIM request ${order.orderNumber}${note ? `: ${note}` : ""}`,
      });
      await base44.asServiceRole.entities.Notification.create({
        userId: order.userId,
        userEmail: customerEmail,
        title: action === "approve" ? "eSIM request approved" : "eSIM request update",
        message: action === "approve"
          ? `${order.planName} was approved and is waiting for an available eSIM.`
          : `${order.planName} was not approved${note ? `: ${note}` : "."}`,
        type: action === "approve" ? "success" : "warning",
      });
      return Response.json({ success: true, order: updated });
    }

    if (!esimId || typeof esimId !== "string") {
      return Response.json({ error: "Select an available eSIM" }, { status: 400 });
    }
    if (order.status !== "approved") {
      return Response.json({ error: `A ${order.status} request cannot be assigned` }, { status: 409 });
    }

    const esim = await base44.asServiceRole.entities.Esim.get(esimId);
    if (!esim || esim.status !== "available") {
      return Response.json({ error: "That eSIM is no longer available" }, { status: 409 });
    }
    if (esim.planId && order.planId && esim.planId !== order.planId) {
      return Response.json({ error: "The selected eSIM does not match the requested plan" }, { status: 409 });
    }
    if (!esim.planId && esim.planName && order.planName && esim.planName !== order.planName) {
      return Response.json({ error: "The selected eSIM does not match the requested plan" }, { status: 409 });
    }

    const assignedAt = new Date().toISOString();
    await base44.asServiceRole.entities.Esim.update(esim.id, {
      assignedUserId: order.userId,
      assignedUserEmail: customerEmail,
      assignedUserName: order.userName || customer?.full_name || customerEmail,
      assignedAt,
      status: "assigned",
    });
    const activation = await base44.asServiceRole.entities.Activation.create({
      esimId: esim.id,
      esimIccid: esim.iccid,
      userId: order.userId,
      userEmail: customerEmail,
      userName: order.userName || customer?.full_name || customerEmail,
      planName: order.planName || esim.planName,
      status: "pending",
      activationCode: esim.activationCode || "",
      qrCodeUrl: esim.qrCodeUrl || "",
      notes: "Created when inventory was assigned to an approved request",
    });
    const updatedOrder = await base44.asServiceRole.entities.Order.update(order.id, {
      esimId: esim.id,
      userEmail: customerEmail,
      status: "assigned",
      paymentStatus: "not_required",
      adminNote: note,
    });
    await base44.asServiceRole.entities.AuditLog.create({
      userId: actor.id,
      userName: actorName,
      action: "ASSIGN",
      entityType: "Order",
      entityId: order.id,
      description: `Assigned ICCID ${esim.iccid} to request ${order.orderNumber}${note ? `: ${note}` : ""}`,
    });
    await base44.asServiceRole.entities.Notification.create({
      userId: order.userId,
      userEmail: customerEmail,
      title: "Your eSIM is ready",
      message: `${order.planName} has been assigned. Open My eSIMs to view the QR code and activation details.`,
      type: "success",
    });

    return Response.json({ success: true, order: updatedOrder, activation });
  } catch (error) {
    console.error("manage-esim-request failed", error);
    return Response.json({ error: error?.message || "Unable to manage request" }, { status: 500 });
  }
});
