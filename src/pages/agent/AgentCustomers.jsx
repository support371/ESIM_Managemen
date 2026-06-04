import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function AgentCustomers() {
  const { user } = useAuth();
  const { data: customers = [] } = useQuery({
    queryKey: ['agent-customers'],
    queryFn: () => base44.entities.User.filter({ assignedAgentId: user?.id }),
  });

  const columns = [
    { key: 'full_name', label: 'Name', render: r => <span className="font-medium">{r.full_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'company', label: 'Company', render: r => r.company || '-' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status || 'active'} /> },
    { key: 'created_date', label: 'Joined', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="My Customers" description={`${customers.length} assigned customers`} />
      <DataTable data={customers} columns={columns} searchFields={['full_name', 'email']} emptyTitle="No customers assigned" />
    </div>
  );
}