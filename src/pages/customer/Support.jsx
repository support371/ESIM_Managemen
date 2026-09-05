import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Mail, Phone, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useContactSettings } from '@/hooks/useContactSettings';

export default function Support() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '', category: 'general', priority: 'medium' });

  const { supportEmail, supportPhone, supportInstructions, isFreeMode } = useContactSettings();

  const { data: tickets = [] } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => base44.entities.SupportTicket.filter({ userId: user?.id }, '-created_date'),
  });

  const createTicket = useMutation({
    mutationFn: (data) => base44.entities.SupportTicket.create({
      ...data,
      ticketNumber: `TKT-${Date.now().toString(36).toUpperCase()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.full_name,
      status: 'open',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      toast({ title: 'Ticket created', description: 'Our support team will respond shortly.' });
      setOpen(false);
      setForm({ subject: '', message: '', category: 'general', priority: 'medium' });
    },
  });

  const columns = [
    { key: 'ticketNumber', label: 'Ticket #', render: r => <span className="font-medium">{r.ticketNumber}</span> },
    { key: 'subject', label: 'Subject' },
    { key: 'category', label: 'Category', render: r => <span className="capitalize">{r.category}</span> },
    { key: 'priority', label: 'Priority', render: r => <StatusBadge status={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_date', label: 'Created', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
    { key: 'actions', label: '', render: r => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDetail(r); }}>View</Button> },
  ];

  return (
    <div>
      <PageHeader
        title="Support"
        description="Get help with your eSIM or account"
        action={<Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> New Ticket</Button>}
      />

      {/* Free service notice + contact info */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {isFreeMode && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Free eSIM Approval Service</p>
              <p className="text-xs text-emerald-700 mt-1">This is a free service. No payment required. Requests are reviewed and approved by our team.</p>
            </div>
          </div>
        )}
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3">Contact Us Directly</p>
          <div className="space-y-2">
            <a href={`mailto:${supportEmail}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Mail className="w-4 h-4 flex-shrink-0" /> {supportEmail}
            </a>
            <a href={`tel:${supportPhone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Phone className="w-4 h-4 flex-shrink-0" /> {supportPhone}
            </a>
          </div>
          {supportInstructions && (
            <p className="text-xs text-muted-foreground mt-3 border-t pt-3">{supportInstructions}</p>
          )}
        </Card>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        searchFields={['ticketNumber', 'subject']}
        emptyTitle="No tickets yet"
        emptyDescription="Create a support ticket if you need help with your eSIM request or account."
      />

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Support Ticket</DialogTitle></DialogHeader>
          {isFreeMode && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              <Gift className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              Free service — no billing or payment issues apply.
            </div>
          )}
          <div className="space-y-4">
            <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['activation', 'technical', 'account', 'general', 'other'].map(c => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['low', 'medium', 'high', 'critical'].map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Message</Label><Textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createTicket.mutate(form)} disabled={!form.subject || !form.message || createTicket.isPending}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ticket {detail?.ticketNumber}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex gap-2"><StatusBadge status={detail.status} /><StatusBadge status={detail.priority} /></div>
              <div><p className="text-sm font-medium">Subject</p><p>{detail.subject}</p></div>
              <div><p className="text-sm font-medium">Message</p><p className="text-sm text-muted-foreground whitespace-pre-wrap">{detail.message}</p></div>
              {detail.response ? (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm font-medium text-primary mb-1">Support Response</p>
                  <p className="text-sm whitespace-pre-wrap">{detail.response}</p>
                </Card>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  No response yet. You can also reach us at <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a> or <a href={`tel:${supportPhone}`} className="hover:text-foreground">{supportPhone}</a>.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
