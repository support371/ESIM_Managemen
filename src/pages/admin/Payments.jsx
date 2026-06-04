import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function Payments() {
  const { data: payments = [] } = useQuery({ queryKey: ['all-payments'], queryFn: () => base44.entities.Payment.list('-created_date') });

  const total = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);

  const columns = [
    { key: 'userName', label: 'Customer', render: r => <span className="font-medium">{r.userName}</span> },
    { key: 'amount', label: 'Amount', render: r => `$${r.amount?.toFixed(2)}` },
    { key: 'paymentMethod', label: 'Method', render: r => (r.paymentMethod || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { key: 'transactionReference', label: 'Reference', render: r => <span className="font-mono text-xs">{r.transactionReference || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'paidAt', label: 'Paid', render: r => r.paidAt ? format(new Date(r.paidAt), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="Payments" description={`Total revenue: $${total.toLocaleString()}`} />
      <DataTable data={payments} columns={columns} searchFields={['userName', 'transactionReference']} />
    </div>
  );
}