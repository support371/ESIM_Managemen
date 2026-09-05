import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EsimRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [selectedEsimId, setSelectedEsimId] = useState('');

  const { data: orders = [] } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const { data: availableEsims = [] } = useQuery({
    queryKey: ['available-esims'],
    queryFn: () => base44.entities.Esim.filter({ status: 'available' }),
  });

  const updateRequest = useMutation({
    mutationFn: ({ id, status }) => base44.functions.invoke('manage-esim-request', {
      orderId: id,
      action: status === 'approved' ? 'approve' : status === 'rejected' ? 'reject' : 'assign',
      esimId: status === 'assigned' ? selectedEsimId : undefined,
      adminNote,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['available-esims'] });
      queryClient.invalidateQueries({ queryKey: ['all-activations'] });
      setSelected(null);
      setAdminNote('');
      setSelectedEsimId('');
      toast({ title: 'Request updated', description: 'The eSIM request status has been updated.' });
    },
    onError: (error) => toast({
      variant: 'destructive',
      title: 'Request was not updated',
      description: error?.response?.data?.error || error?.message || 'Please try again.',
    }),
  });

  const pendingCount = orders.filter(o => ['pending', 'pending_review', 'pending_approval', 'processing'].includes(o.status)).length;

  const columns = [
    { key: 'orderNumber', label: 'Request #', render: r => <span className="font-mono text-xs font-medium">{r.orderNumber}</span> },
    { key: 'userName', label: 'Customer' },
    { key: 'planName', label: 'Plan' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_date', label: 'Submitted', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
    {
      key: 'actions', label: '', render: r => (
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          setSelected(r);
          setNewStatus(['pending', 'pending_approval', 'processing'].includes(r.status) ? 'pending_review' : r.status);
          setAdminNote('');
          setSelectedEsimId('');
        }}>
          Review
        </Button>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="eSIM Requests"
        description={`${orders.length} total requests · ${pendingCount} pending approval · ${availableEsims.length} eSIMs available`}
      />

      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800"><span className="font-semibold">{pendingCount} request{pendingCount !== 1 ? 's' : ''}</span> awaiting your review and approval.</p>
        </div>
      )}

      <DataTable
        data={orders}
        columns={columns}
        searchFields={['orderNumber', 'userName', 'planName']}
        searchPlaceholder="Search requests..."
        emptyTitle="No requests yet"
        emptyDescription="Customer eSIM requests will appear here."
      />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review Request — {selected?.orderNumber}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm p-4 bg-muted/50 rounded-lg">
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selected.userName}</p></div>
                <div><p className="text-muted-foreground text-xs">Plan</p><p className="font-medium">{selected.planName}</p></div>
                <div><p className="text-muted-foreground text-xs">Current Status</p><StatusBadge status={selected.status} /></div>
                <div><p className="text-muted-foreground text-xs">Service</p><span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Free</span></div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    {['pending', 'pending_review', 'pending_approval', 'processing', 'approved'].includes(selected?.status) && (
                      <SelectItem value="approved">Approved</SelectItem>
                    )}
                    {['pending', 'pending_review', 'pending_approval', 'processing', 'approved'].includes(selected?.status) && (
                      <SelectItem value="rejected">Rejected</SelectItem>
                    )}
                    {selected?.status === 'approved' && <SelectItem value="assigned">eSIM Assigned</SelectItem>}
                    {!['pending', 'pending_review', 'pending_approval', 'processing', 'approved'].includes(selected?.status) && (
                      <SelectItem value={selected?.status}>{(selected?.status || '').replace(/_/g, ' ')}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {newStatus === 'assigned' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Available eSIM</Label>
                  <Select value={selectedEsimId} onValueChange={setSelectedEsimId}>
                    <SelectTrigger><SelectValue placeholder="Select matching inventory" /></SelectTrigger>
                    <SelectContent>
                      {availableEsims
                        .filter(esim => !esim.planId || !selected?.planId || esim.planId === selected.planId)
                        .filter(esim => !esim.planName || !selected?.planName || esim.planName === selected.planName)
                        .map(esim => (
                          <SelectItem key={esim.id} value={esim.id}>
                            {esim.planName || 'Unspecified plan'} · {esim.iccid}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {availableEsims.length === 0 && (
                    <p className="text-xs text-amber-700 mt-2">No inventory is available. Add a genuine provider-issued eSIM before assigning this request.</p>
                  )}
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Admin Note (optional)</Label>
                <Textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note for the audit log..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => { setNewStatus('approved'); }}
                >
                  <CheckCircle className="w-4 h-4" /> Quick Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => { setNewStatus('rejected'); }}
                >
                  <XCircle className="w-4 h-4" /> Quick Reject
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button
              onClick={() => updateRequest.mutate({ id: selected.id, status: newStatus })}
              disabled={updateRequest.isPending || !['approved', 'rejected', 'assigned'].includes(newStatus) || newStatus === selected?.status || (newStatus === 'assigned' && !selectedEsimId)}
            >
              {updateRequest.isPending ? 'Saving...' : 'Save Decision'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
