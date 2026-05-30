import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const initForm = { iccid: '', provider: '', planName: '', qrCodeUrl: '', activationCode: '', status: 'available' };

export default function EsimInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(null);
  const [form, setForm] = useState(initForm);
  const [assignUserId, setAssignUserId] = useState('');

  const { data: esims = [] } = useQuery({ queryKey: ['all-esims'], queryFn: () => base44.entities.Esim.list('-created_date') });
  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: () => base44.entities.User.list() });
  const { data: plans = [] } = useQuery({ queryKey: ['all-plans'], queryFn: () => base44.entities.Plan.list() });

  const customers = users.filter(u => u.role === 'customer');

  const createEsim = useMutation({
    mutationFn: (data) => base44.entities.Esim.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-esims'] }); setAddOpen(false); setForm(initForm); toast({ title: 'eSIM added' }); },
  });

  const assignEsim = useMutation({
    mutationFn: async ({ esimId, userId }) => {
      const customer = customers.find(c => c.id === userId);
      await base44.entities.Esim.update(esimId, {
        assignedUserId: userId,
        assignedUserName: customer?.full_name || '',
        assignedAt: new Date().toISOString(),
        status: 'assigned',
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-esims'] }); setAssignOpen(null); setAssignUserId(''); toast({ title: 'eSIM assigned' }); },
  });

  const columns = [
    { key: 'iccid', label: 'ICCID', render: r => <span className="font-mono text-xs">{r.iccid}</span> },
    { key: 'provider', label: 'Provider' },
    { key: 'planName', label: 'Plan', render: r => r.planName || '-' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'assignedUserName', label: 'Assigned To', render: r => r.assignedUserName || '-' },
    { key: 'created_date', label: 'Added', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d') : '-' },
    {
      key: 'actions', label: '', render: r => r.status === 'available' ? (
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setAssignOpen(r); }}>
          <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
        </Button>
      ) : null
    },
  ];

  return (
    <div>
      <PageHeader
        title="eSIM Inventory"
        description={`${esims.length} total · ${esims.filter(e => e.status === 'available').length} available`}
        action={<Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add eSIM</Button>}
      />
      <DataTable data={esims} columns={columns} searchFields={['iccid', 'provider', 'planName', 'assignedUserName']} searchPlaceholder="Search eSIMs..." />

      {/* Add eSIM */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add eSIM</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>ICCID</Label><Input value={form.iccid} onChange={e => setForm({ ...form, iccid: e.target.value })} placeholder="89012..." /></div>
            <div><Label>Provider</Label><Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="Provider name" /></div>
            <div>
              <Label>Plan</Label>
              <Select value={form.planName} onValueChange={v => setForm({ ...form, planName: v })}>
                <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {plans.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>QR Code URL</Label><Input value={form.qrCodeUrl} onChange={e => setForm({ ...form, qrCodeUrl: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Activation Code</Label><Input value={form.activationCode} onChange={e => setForm({ ...form, activationCode: e.target.value })} placeholder="LPA:1$..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => createEsim.mutate(form)} disabled={!form.iccid || !form.provider}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign eSIM */}
      <Dialog open={!!assignOpen} onOpenChange={() => setAssignOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign eSIM</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Assign ICCID {assignOpen?.iccid} to a customer</p>
          <Select value={assignUserId} onValueChange={setAssignUserId}>
            <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
            <SelectContent>
              {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name} ({c.email})</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(null)}>Cancel</Button>
            <Button onClick={() => assignEsim.mutate({ esimId: assignOpen.id, userId: assignUserId })} disabled={!assignUserId}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}