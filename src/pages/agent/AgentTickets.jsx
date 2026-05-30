import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function AgentTickets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [response, setResponse] = useState('');

  const { data: tickets = [] } = useQuery({
    queryKey: ['agent-tickets'],
    queryFn: () => base44.entities.SupportTicket.filter({ assignedTo: user?.id }, '-created_date'),
  });

  const updateTicket = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SupportTicket.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['agent-tickets'] }); setSelected(null); toast({ title: 'Ticket updated' }); },
  });

  const columns = [
    { key: 'ticketNumber', label: '#', render: r => <span className="font-medium">{r.ticketNumber}</span> },
    { key: 'userName', label: 'Customer' },
    { key: 'subject', label: 'Subject' },
    { key: 'priority', label: 'Priority', render: r => <StatusBadge status={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_date', label: 'Created', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d') : '-' },
    { key: 'actions', label: '', render: r => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(r); setNewStatus(r.status); setResponse(r.response || ''); }}>Respond</Button> },
  ];

  return (
    <div>
      <PageHeader title="Support Tickets" description="Tickets assigned to you" />
      <DataTable data={tickets} columns={columns} searchFields={['ticketNumber', 'userName', 'subject']} emptyTitle="No tickets assigned" />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ticket {selected?.ticketNumber}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex gap-2"><StatusBadge status={selected.priority} /><StatusBadge status={selected.status} /></div>
              <div><p className="text-sm font-medium">{selected.subject}</p><p className="text-sm text-muted-foreground mt-1">{selected.message}</p></div>
              <div>
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['open', 'in_progress', 'waiting', 'resolved', 'closed'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Response</Label><Textarea rows={3} value={response} onChange={e => setResponse(e.target.value)} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={() => updateTicket.mutate({ id: selected.id, data: { status: newStatus, response } })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}