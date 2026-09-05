import { createClientFromRequest } from "npm:@base44/sdk";

const OPEN_STATUSES = new Set(["pending_review", "approved", "assigned", "activated"]);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.status === "suspended" || user.status === "inactive") {
      return Response.json({ error: "An active account is required" }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!planId || typeof planId !== "string") {
      return Response.json({ error: "A valid plan is required" }, { status: 400 });
    }

    const plan = await base44.asServiceRole.entities.Plan.get(planId);
    if (!plan || plan.status !== "active") {
      return Response.json({ error: "This plan is not available" }, { status: 404 });
    }

    const existing = await base44.asServiceRole.entities.Order.filter({ userId: user.id });
    const duplicate = existing.find((order) => order.planId === plan.id && OPEN_STATUSES.has(order.status));
    if (duplicate) {
      return Response.json(
        { error: "You already have an open request for this plan", orderId: duplicate.id },
        { status: 409 },
      );
    }

    const order = await base44.entities.Order.create({
      orderNumber: `REQ-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.full_name || user.email,
      planId: plan.id,
      planName: plan.name,
      amount: 0,
      currency: plan.currency || "USD",
      status: "pending_review",
      paymentStatus: "not_required",
    });

    await base44.asServiceRole.entities.AuditLog.create({
      userId: user.id,
      userName: user.full_name || user.email,
      action: "CREATE",
      entityType: "Order",
      entityId: order.id,
      description: `Submitted eSIM request ${order.orderNumber} for ${plan.name}`,
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("request-esim failed", error);
    return Response.json({ error: error?.message || "Unable to submit request" }, { status: 500 });
  }
});
