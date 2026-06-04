import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin, isSuperAdmin, isAgent } from '@/lib/roleUtils';
import CustomerDashboard from '@/components/dashboards/CustomerDashboard';
import AgentDashboard from '@/components/dashboards/AgentDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  if (isAdmin(role) || isSuperAdmin(role)) return <AdminDashboard user={user} />;
  if (isAgent(role)) return <AgentDashboard user={user} />;
  return <CustomerDashboard user={user} />;
}