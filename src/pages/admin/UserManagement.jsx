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
import { formatRole, getRoleBadgeColor } from '@/lib/roleUtils';
import { format } from 'date-fns';

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: () => base44.entities.User.list() });

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-users'] }); setSelected(null); toast({ title: 'User updated' }); },
  });

  const columns = [
    { key: 'full_name', label: 'Name', render: r => <span className="font-medium">{r.full_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: r => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(r.role)}`}>{formatRole(r.role)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status || 'active'} /> },
    { key: 'created_date', label: 'Joined', render: r => r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '-' },
    { key: 'actions', label: '', render: r => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(r); setNewRole(r.role || 'customer'); setNewStatus(r.status || 'active'); }}>Edit</Button> },
  ];

  return (
    <div>
      <PageHeader title="User Management" description={`${users.length} total users across all roles`} />
      <DataTable data={users} columns={columns} searchFields={['full_name', 'email']} searchPlaceholder="Search users..." />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Name</p><p className="font-medium">{selected.full_name}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selected.email}</p></div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Role</p>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['customer', 'agent', 'admin', 'super_admin'].map(r => <SelectItem key={r} value={r}>{formatRole(r)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Status</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['active', 'inactive', 'suspended'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={() => updateUser.mutate({ id: selected.id, data: { role: newRole, status: newStatus } })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}