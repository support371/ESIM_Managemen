import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/shared/StatusBadge';
import { User, Mail, Phone, Building } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ phone: '', company: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ phone: user.phone || '', company: user.company || '' });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    toast({ title: 'Profile updated' });
    setSaving(false);
  };

  return (
    <div>
      <PageHeader title="Profile Settings" description="Manage your account information" />
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</Label>
              <Input value={user?.full_name || ''} disabled className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={user?.email || ''} disabled className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1" placeholder="Enter phone number" />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Company</Label>
              <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="mt-1" placeholder="Company name" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex gap-2">
              <StatusBadge status={user?.role || 'customer'} />
              <StatusBadge status={user?.status || 'active'} />
            </div>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}