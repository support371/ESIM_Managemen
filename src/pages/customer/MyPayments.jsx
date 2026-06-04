import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function MyPayments() {
  const { user } = useAuth();
  const { data: payments = [] } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => base44.entities.Payment.filter({ userId: user?.id }, '-created_date'),
  });

  const columns = [
    { key: 'orderId', label: 'Order', render: r => <span className="font-medium">{r.orderId?.slice(0, 8) || '-'}</span> },
    { key: 'amount', label: 'Amount', render: r => `$${r.amount?.toFixed(2)}` },
    { key: 'paymentMethod', label: 'Method', render: r => (r.paymentMethod || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'paidAt', label: 'Paid', render: r => r.paidAt ? format(new Date(r.paidAt), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="My Payments" description="Your payment history" />
      <DataTable data={payments} columns={columns} searchFields={['transactionReference']} emptyTitle="No payments yet" />
    </div>
  );
}