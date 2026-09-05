import { createClientFromRequest } from "npm:@base44/sdk";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const STATUSES = new Set(["pending", "active", "suspended", "expired", "deactivated"]);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const actor = await base44.auth.me();
    if (!actor || !ADMIN_ROLES.has(actor.role)) {
      return Response.json({ error: "Administrator access is required" }, { status: 403 });
    }

    const { activationId, status } = await req.json();
    if (!activationId || !STATUSES.has(status)) {
      return Response.json({ error: "A valid activation and status are required" }, { status: 400 });
    }

    const activation = await base44.asServiceRole.entities.Activation.get(activationId);
    if (!activation) return Response.json({ error: "Activation not found" }, { status: 404 });

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { status };
    if (status === "active" && !activation.activatedAt) updates.activatedAt = now;
    const updated = await base44.asServiceRole.entities.Activation.update(activation.id, updates);

    const esimStatus = status === "active"
      ? "activated"
      : status === "expired"
        ? "expired"
        : status === "deactivated"
          ? "disabled"
          : "assigned";
    await base44.asServiceRole.entities.Esim.update(activation.esimId, {
      status: esimStatus,
      ...(status === "active" ? { activatedAt: activation.activatedAt || now } : {}),
    });

    if (status === "active") {
      const orders = await base44.asServiceRole.entities.Order.filter({ esimId: activation.esimId });
      if (orders[0]) await base44.asServiceRole.entities.Order.update(orders[0].id, { status: "activated" });
    }

    await base44.asServiceRole.entities.AuditLog.create({
      userId: actor.id,
      userName: actor.full_name || actor.email || "Administrator",
      action: "UPDATE",
      entityType: "Activation",
      entityId: activation.id,
      description: `Set activation for ICCID ${activation.esimIccid} to ${status}`,
    });

    return Response.json({ success: true, activation: updated });
  } catch (error) {
    console.error("manage-activation failed", error);
    return Response.json({ error: error?.message || "Unable to update activation" }, { status: 500 });
  }
});
