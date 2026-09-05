import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Plus, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

const initForm = { iccid: '', provider: '', planName: '', qrCodeUrl: '', activationCode: '', status: 'available' };

export default function EsimInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initForm);

  const { data: esims = [] } = useQuery({ queryKey: ['all-esims'], queryFn: () => base44.entities.Esim.list('-created_date') });
  const { data: plans = [] } = useQuery({ queryKey: ['all-plans'], queryFn: () => base44.entities.Plan.list() });

  const createEsim = useMutation({
    mutationFn: (data) => {
      const plan = plans.find(item => item.name === data.planName);
      return base44.entities.Esim.create({ ...data, planId: plan?.id || '' });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-esims'] }); setAddOpen(false); setForm(initForm); toast({ title: 'eSIM added' }); },
    onError: (error) => toast({ variant: 'destructive', title: 'eSIM was not added', description: error?.message || 'Please try again.' }),
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
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/orders"><ShoppingCart className="w-3.5 h-3.5 mr-1" /> Assign to Request</Link>
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
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        Inventory is assigned from <Link to="/admin/orders" className="font-semibold underline">eSIM Requests</Link> so every QR code is tied to an approved customer request and activation record.
      </div>
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
            <Button
              onClick={() => createEsim.mutate(form)}
              disabled={!form.iccid.trim() || !form.provider.trim() || !form.planName || (!form.qrCodeUrl.trim() && !form.activationCode.trim()) || createEsim.isPending}
            >
              {createEsim.isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
