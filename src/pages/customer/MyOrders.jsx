import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

const REQUEST_STATUS_LABELS = {
  pending_review: 'Pending Review',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  assigned: 'eSIM Assigned',
  activated: 'Activated',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  pending: 'Pending Review',
  processing: 'Under Review',
  completed: 'Approved',
};

export default function MyRequests() {
  const { user } = useAuth();
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => base44.entities.Order.filter({ userId: user?.id }, '-created_date'),
  });

  const columns = [
    { key: 'orderNumber', label: 'Request #', render: r => <span className="font-medium font-mono text-sm">{r.orderNumber}</span> },
    { key: 'planName', label: 'Plan' },
    {
      key: 'status', label: 'Request Status', render: r => (
        <StatusBadge status={r.status} />
      )
    },
    {
      key: 'service', label: 'Service', render: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Free</span>
      )
    },
    { key: 'created_date', label: 'Submitted', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="My eSIM Requests" description="Track the status of your free eSIM requests" />
      <DataTable
        data={orders}
        columns={columns}
        searchFields={['orderNumber', 'planName']}
        searchPlaceholder="Search requests..."
        emptyTitle="No requests yet"
        emptyDescription="Browse free plans and submit an eSIM request to get started."
      />
    </div>
  );
}
