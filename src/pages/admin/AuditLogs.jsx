import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';

export default function AuditLogs() {
  const { data: logs = [] } = useQuery({ queryKey: ['audit-logs'], queryFn: () => base44.entities.AuditLog.list('-created_date') });

  const columns = [
    { key: 'userName', label: 'User', render: r => <span className="font-medium">{r.userName || '-'}</span> },
    { key: 'action', label: 'Action', render: r => <span className="font-medium text-primary">{r.action}</span> },
    { key: 'entityType', label: 'Entity', render: r => r.entityType || '-' },
    { key: 'description', label: 'Description', render: r => <span className="text-sm">{r.description}</span> },
    { key: 'ipAddress', label: 'IP', render: r => <span className="font-mono text-xs">{r.ipAddress || '-'}</span> },
    { key: 'created_date', label: 'Time', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, HH:mm') : '-' },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" description="Track system activities and changes" />
      <DataTable data={logs} columns={columns} searchFields={['userName', 'action', 'description', 'entityType']} searchPlaceholder="Search logs..." emptyTitle="No audit logs" />
    </div>
  );
}