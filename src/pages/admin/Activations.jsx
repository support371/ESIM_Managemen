import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function Activations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const { data: activations = [] } = useQuery({ queryKey: ['all-activations'], queryFn: () => base44.entities.Activation.list('-created_date') });

  const updateActivation = useMutation({
    mutationFn: ({ id, status }) => {
      const updates = { status };
      if (status === 'active') updates.activatedAt = new Date().toISOString();
      return base44.entities.Activation.update(id, updates);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-activations'] }); setSelected(null); toast({ title: 'Activation updated' }); },
  });

  const columns = [
    { key: 'esimIccid', label: 'ICCID', render: r => <span className="font-mono text-xs">{r.esimIccid}</span> },
    { key: 'userName', label: 'Customer' },
    { key: 'planName', label: 'Plan' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'activatedAt', label: 'Activated', render: r => r.activatedAt ? format(new Date(r.activatedAt), 'MMM d, yyyy') : '-' },
    { key: 'expiresAt', label: 'Expires', render: r => r.expiresAt ? format(new Date(r.expiresAt), 'MMM d, yyyy') : '-' },
    { key: 'actions', label: '', render: r => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(r); setNewStatus(r.status); }}>Edit</Button> },
  ];

  return (
    <div>
      <PageHeader title="Activations" description={`${activations.length} total activations`} />
      <DataTable data={activations} columns={columns} searchFields={['esimIccid', 'userName', 'planName']} />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Activation</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selected?.userName}</p></div>
              <div><p className="text-muted-foreground">Plan</p><p className="font-medium">{selected?.planName}</p></div>
            </div>
            <div>
              <p className="font-medium mb-2">Status</p>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['pending', 'active', 'suspended', 'expired', 'deactivated'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={() => updateActivation.mutate({ id: selected.id, status: newStatus })}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}