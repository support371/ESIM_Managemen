import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Save, AlertCircle, Info } from 'lucide-react';

// Keys that should render as textarea
const TEXTAREA_KEYS = ['support_instructions'];

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState({});

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.SystemSetting.list(),
  });

  const updateSetting = useMutation({
    mutationFn: async () => {
      const promises = Object.entries(edits).map(([id, value]) =>
        base44.entities.SystemSetting.update(id, { value })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setEdits({});
      toast({ title: 'Settings saved', description: 'Your changes have been applied.' });
    },
  });

  const categories = [...new Set(settings.map(s => s.category || 'general'))];
  const getValue = (setting) => edits[setting.id] !== undefined ? edits[setting.id] : (setting.value || '');

  const serviceMode = settings.find(s => s.key === 'service_mode');
  const isFreeMode = !serviceMode || serviceMode.value === 'free_approval';

  // Detect unconfigured contact fields (still have placeholder values)
  const adminEmail = settings.find(s => s.key === 'admin_email')?.value || '';
  const supportPhone = settings.find(s => s.key === 'support_phone')?.value || '';
  const needsSetup = adminEmail.includes('yourdomain') || supportPhone.includes('000-0000');

  return (
    <div>
      {/* Setup notice */}
      {needsSetup && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-300 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Action Required — Update Contact Details</p>
            <p className="text-xs text-amber-700 mt-1">
              Your <strong>Admin Email</strong> and <strong>Support Phone Number</strong> still have placeholder values.
              Please update them below so customers see your real contact information on the Contact and Support pages.
            </p>
          </div>
        </div>
      )}

      {/* Free mode notice */}
      {isFreeMode && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Free Approval-Based Service Mode Active</p>
            <p className="text-xs text-emerald-700 mt-1">
              Payments are currently <strong>disabled</strong>. Customers submit free eSIM requests and admins approve/assign them.
              To enable paid checkout in the future, set <code className="bg-emerald-100 px-1 rounded">service_mode</code> to <code className="bg-emerald-100 px-1 rounded">paid</code> and <code className="bg-emerald-100 px-1 rounded">payments_enabled</code> to <code className="bg-emerald-100 px-1 rounded">true</code>.
            </p>
          </div>
        </div>
      )}

      <PageHeader
        title="System Settings"
        description="Configure platform settings, contact info, and service mode"
        action={
          Object.keys(edits).length > 0 && (
            <Button onClick={() => updateSetting.mutate()} className="gap-2" disabled={updateSetting.isPending}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          )
        }
      />

      {settings.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No settings configured yet.</Card>
      ) : (
        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList>
            {categories.map(c => (
              <TabsTrigger key={c} value={c} className="capitalize">{c}</TabsTrigger>
            ))}
          </TabsList>
          {categories.map(cat => (
            <TabsContent key={cat} value={cat}>
              <Card className="p-6">
                <div className="space-y-6">
                  {settings.filter(s => (s.category || 'general') === cat).map(setting => (
                    <div key={setting.id} className="grid sm:grid-cols-3 gap-4 items-start">
                      <div>
                        <Label className="font-medium">{setting.label}</Label>
                        {setting.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                        )}
                        {/* Flag unconfigured placeholders */}
                        {(setting.key === 'admin_email' && getValue(setting).includes('yourdomain')) && (
                          <p className="text-xs text-amber-600 font-medium mt-1">⚠ Please update this</p>
                        )}
                        {(setting.key === 'support_phone' && getValue(setting).includes('000-0000')) && (
                          <p className="text-xs text-amber-600 font-medium mt-1">⚠ Please update this</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        {TEXTAREA_KEYS.includes(setting.key) ? (
                          <Textarea
                            rows={3}
                            value={getValue(setting)}
                            onChange={e => setEdits({ ...edits, [setting.id]: e.target.value })}
                          />
                        ) : (
                          <Input
                            value={getValue(setting)}
                            onChange={e => setEdits({ ...edits, [setting.id]: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}