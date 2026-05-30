// Role hierarchy: super_admin > admin > agent > customer
const ROLE_HIERARCHY = { super_admin: 4, admin: 3, agent: 2, customer: 1 };

export const hasMinRole = (userRole, minRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
};

export const isAdmin = (role) => hasMinRole(role, 'admin');
export const isSuperAdmin = (role) => role === 'super_admin';
export const isAgent = (role) => hasMinRole(role, 'agent');
export const isCustomer = (role) => role === 'customer';

export const getRoleBadgeColor = (role) => {
  const colors = {
    super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
    admin: 'bg-blue-100 text-blue-700 border-blue-200',
    agent: 'bg-teal-100 text-teal-700 border-teal-200',
    customer: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[role] || colors.customer;
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activated: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
    pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    assigned: 'bg-blue-100 text-blue-700 border-blue-200',
    waiting: 'bg-amber-100 text-amber-700 border-amber-200',
    open: 'bg-amber-100 text-amber-700 border-amber-200',
    available: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    not_required: 'bg-slate-100 text-slate-500 border-slate-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
    disabled: 'bg-slate-100 text-slate-500 border-slate-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-orange-100 text-orange-700 border-orange-200',
    expired: 'bg-slate-100 text-slate-500 border-slate-200',
    unpaid: 'bg-red-100 text-red-700 border-red-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
};

export const formatRole = (role) => {
  return (role || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const formatStatus = (status) => {
  return (status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};