import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { format } from 'date-fns';

export default function MyActivations() {
  const { user } = useAuth();
  const { data: activations = [] } = useQuery({
    queryKey: ['my-activations'],
    queryFn: () => base44.entities.Activation.filter({ userId: user?.id }, '-created_date'),
  });

  const columns = [
    { key: 'esimIccid', label: 'ICCID', render: r => <span className="font-mono text-xs">{r.esimIccid}</span> },
    { key: 'planName', label: 'Plan' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'activatedAt', label: 'Activated', render: r => r.activatedAt ? format(new Date(r.activatedAt), 'MMM d, yyyy') : '-' },
    { key: 'expiresAt', label: 'Expires', render: r => r.expiresAt ? format(new Date(r.expiresAt), 'MMM d, yyyy') : '-' },
  ];

  return (
    <div>
      <PageHeader title="My Activations" description="Track your eSIM activation status" />
      <DataTable data={activations} columns={columns} searchFields={['esimIccid', 'planName']} emptyTitle="No activations yet" />
    </div>
  );
}
