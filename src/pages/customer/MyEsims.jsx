import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Smartphone, QrCode, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function MyEsims() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);

  const { data: esims = [] } = useQuery({
    queryKey: ['my-esims'],
    queryFn: () => base44.entities.Esim.filter({ assignedUserId: user?.id }),
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Activation code copied to clipboard.' });
  };

  if (esims.length === 0) {
    return (
      <div>
        <PageHeader title="My eSIMs" />
        <EmptyState icon={Smartphone} title="No eSIMs yet" description="Your assigned eSIMs will appear here once an order is processed." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My eSIMs" description={`${esims.length} eSIM(s) assigned to your account`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {esims.map(esim => (
          <Card key={esim.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(esim)}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <StatusBadge status={esim.status} />
            </div>
            <h3 className="font-semibold">{esim.planName || 'eSIM'}</h3>
            <p className="text-xs text-muted-foreground mt-1">ICCID: {esim.iccid}</p>
            <p className="text-xs text-muted-foreground">Provider: {esim.provider}</p>
            {esim.expiresAt && (
              <p className="text-xs text-muted-foreground mt-2">Expires: {format(new Date(esim.expiresAt), 'MMM d, yyyy')}</p>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>eSIM Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{selected.planName || 'eSIM'}</span>
                <StatusBadge status={selected.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">ICCID</p><p className="font-medium">{selected.iccid}</p></div>
                <div><p className="text-muted-foreground">Provider</p><p className="font-medium">{selected.provider}</p></div>
                {selected.assignedAt && <div><p className="text-muted-foreground">Assigned</p><p className="font-medium">{format(new Date(selected.assignedAt), 'MMM d, yyyy')}</p></div>}
                {selected.expiresAt && <div><p className="text-muted-foreground">Expires</p><p className="font-medium">{format(new Date(selected.expiresAt), 'MMM d, yyyy')}</p></div>}
              </div>

              {selected.qrCodeUrl && (
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-3">Scan QR Code to Activate</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border">
                    <img src={selected.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain p-2" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    <div className="hidden items-center justify-center flex-col">
                      <QrCode className="w-16 h-16 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-1">QR Code</p>
                    </div>
                  </div>
                </div>
              )}

              {selected.activationCode && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Manual Activation Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-card p-2 rounded border break-all">{selected.activationCode}</code>
                    <Button variant="outline" size="icon" onClick={() => copyCode(selected.activationCode)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}