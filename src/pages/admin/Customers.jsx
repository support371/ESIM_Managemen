import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function Customers() {
  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const customers = users.filter(u => u.role === 'customer');

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
      <PageHeader title="Customers" description={`${customers.length} registered customers`} />
      <DataTable data={customers} columns={columns} searchFields={['full_name', 'email', 'company']} searchPlaceholder="Search customers..." emptyTitle="No customers" />
    </div>
  );
}