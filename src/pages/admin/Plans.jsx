import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil } from 'lucide-react';

const initForm = { name: '', country: '', region: 'Global', dataAmount: '', validityDays: 30, price: 0, currency: 'USD', description: '', features: [], status: 'active', popular: false };
const REGIONS = ['North America', 'Europe', 'Asia', 'Middle East', 'Africa', 'South America', 'Global'];

export default function Plans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initForm);
  const [featuresText, setFeaturesText] = useState('');

  const { data: plans = [] } = useQuery({ queryKey: ['all-plans'], queryFn: () => base44.entities.Plan.list() });

  const savePlan = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, features: featuresText.split('\n').map(f => f.trim()).filter(Boolean) };
      return editing ? base44.entities.Plan.update(editing.id, payload) : base44.entities.Plan.create(payload);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-plans'] }); setOpen(false); setEditing(null); setForm(initForm); setFeaturesText(''); toast({ title: editing ? 'Plan updated' : 'Plan created' }); },
  });

  const openEdit = (plan) => {
    setEditing(plan);
    setForm(plan);
    setFeaturesText((plan.features || []).join('\n'));
    setOpen(true);
  };

  const openNew = () => { setEditing(null); setForm(initForm); setFeaturesText(''); setOpen(true); };

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium">{r.name}</span> },
    { key: 'country', label: 'Country', render: r => r.country || r.region },
    { key: 'dataAmount', label: 'Data' },
    { key: 'validityDays', label: 'Days' },
    { key: 'price', label: 'Price', render: r => <span className="text-emerald-700 font-semibold">Free</span> },
    { key: 'popular', label: 'Popular', render: r => r.popular ? <StatusBadge status="active" /> : '-' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: r => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(r); }}><Pencil className="w-3.5 h-3.5" /></Button> },
  ];

  return (
    <div>
      <PageHeader title="Plans" description="Manage eSIM data plans" action={<Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Plan</Button>} />
      <DataTable data={plans} columns={columns} searchFields={['name', 'country', 'region']} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Plan' : 'Add Plan'}</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Country</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Region</Label>
                <Select value={form.region} onValueChange={v => setForm({ ...form, region: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Data Amount</Label><Input value={form.dataAmount} onChange={e => setForm({ ...form, dataAmount: e.target.value })} placeholder="5GB" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Validity (days)</Label><Input type="number" value={form.validityDays} onChange={e => setForm({ ...form, validityDays: Number(e.target.value) })} /></div>
              <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div><Label>Currency</Label><Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div><Label>Features (one per line)</Label><Textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} rows={3} placeholder="4G/LTE speeds\nHotspot enabled" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.popular} onCheckedChange={v => setForm({ ...form, popular: v })} />
                <Label>Mark as Popular</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => savePlan.mutate(form)} disabled={!form.name}>{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}