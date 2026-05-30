import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import StatCard from '@/components/shared/StatCard';
import { Wallet, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AgentCommissions() {
  const { user } = useAuth();
  const { data: commissions = [] } = useQuery({
    queryKey: ['agent-commissions'],
    queryFn: () => base44.entities.Commission.filter({ agentId: user?.id }, '-created_date'),
  });

  const total = commissions.reduce((s, c) => s + (c.amount || 0), 0);
  const paid = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + (c.amount || 0), 0);
  const pending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount || 0), 0);

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'amount', label: 'Amount', render: r => <span className="font-medium">${r.amount?.toFixed(2)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_date', label: 'Date', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="Commissions" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Earned" value={`$${total.toFixed(2)}`} icon={Wallet} color="primary" />
        <StatCard title="Paid Out" value={`$${paid.toFixed(2)}`} icon={DollarSign} color="accent" />
        <StatCard title="Pending" value={`$${pending.toFixed(2)}`} icon={Clock} color="warning" />
      </div>
      <DataTable data={commissions} columns={columns} searchFields={['customerName']} emptyTitle="No commissions yet" />
    </div>
  );
}