import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function AgentOrders() {
  const { user } = useAuth();
  const { data: customers = [] } = useQuery({
    queryKey: ['agent-customers'],
    queryFn: () => base44.entities.User.filter({ assignedAgentId: user?.id }),
  });
  const customerIds = customers.map(c => c.id);

  const { data: orders = [] } = useQuery({
    queryKey: ['agent-orders', customerIds],
    queryFn: () => base44.entities.Order.list('-created_date'),
    enabled: customerIds.length > 0,
  });

  const agentOrders = orders.filter(o => customerIds.includes(o.userId));

  const columns = [
    { key: 'orderNumber', label: 'Order #', render: r => <span className="font-medium">#{r.orderNumber}</span> },
    { key: 'userName', label: 'Customer' },
    { key: 'planName', label: 'Plan' },
    { key: 'amount', label: 'Amount', render: r => `$${r.amount?.toFixed(2)}` },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_date', label: 'Date', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="Customer Orders" description="Orders from your assigned customers" />
      <DataTable data={agentOrders} columns={columns} searchFields={['orderNumber', 'userName']} emptyTitle="No orders" />
    </div>
  );
}