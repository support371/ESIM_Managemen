import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';

export default function AgentEsims() {
  const { user } = useAuth();
  const { data: customers = [] } = useQuery({
    queryKey: ['agent-customers'],
    queryFn: () => base44.entities.User.filter({ assignedAgentId: user?.id }),
  });
  const customerIds = customers.map(c => c.id);

  const { data: esims = [] } = useQuery({
    queryKey: ['agent-esims', customerIds],
    queryFn: () => base44.entities.Esim.list(),
    enabled: customerIds.length > 0,
  });

  const agentEsims = esims.filter(e => customerIds.includes(e.assignedUserId));

  const columns = [
    { key: 'iccid', label: 'ICCID', render: r => <span className="font-mono text-xs">{r.iccid}</span> },
    { key: 'provider', label: 'Provider' },
    { key: 'planName', label: 'Plan', render: r => r.planName || '-' },
    { key: 'assignedUserName', label: 'Customer' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="eSIM Assignments" description="eSIMs assigned to your customers" />
      <DataTable data={agentEsims} columns={columns} searchFields={['iccid', 'assignedUserName']} emptyTitle="No eSIM assignments" />
    </div>
  );
}