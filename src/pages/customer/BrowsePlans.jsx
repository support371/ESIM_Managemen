import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Star, Search, Gift, ClipboardCheck } from 'lucide-react';

export default function BrowsePlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [requestDialog, setRequestDialog] = useState(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => base44.entities.Plan.filter({ status: 'active' }),
  });

  const submitRequest = useMutation({
    mutationFn: (plan) => base44.functions.invoke('request-esim', { planId: plan.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast({ title: 'Request Submitted!', description: 'Your free eSIM request has been submitted and is pending approval by our team.' });
      setRequestDialog(null);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Request not submitted',
        description: error?.response?.data?.error || error?.message || 'Please try again.',
      });
    },
  });

  const filtered = plans.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.country?.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'all' || p.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const regions = [...new Set(plans.map(p => p.region).filter(Boolean))];

  return (
    <div>
      <PageHeader
        title="Free eSIM Plans"
        description="Browse available plans and request your free eSIM. All plans are free — approval required."
      />

      {/* Free service notice */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
        <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Free Approval-Based Service</p>
          <p className="text-xs text-emerald-700">No payment required. Submit a request and our team will review and assign your eSIM.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans..." className="pl-9" />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Regions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(plan => (
          <Card key={plan.id} className={`p-5 hover:shadow-lg transition-all relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground gap-1"><Star className="w-3 h-3" />Popular</Badge>
            )}
            <p className="text-xs font-medium text-muted-foreground mb-1">{plan.country || plan.region}</p>
            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
            <Badge variant="outline" className="mb-3 text-emerald-700 border-emerald-300 bg-emerald-50 font-semibold">
              FREE
            </Badge>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />{plan.dataAmount} data</div>
              <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />{plan.validityDays} days validity</div>
              {plan.features?.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}</div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Approval required · No payment needed</p>
            <Button className="w-full gap-2" onClick={() => setRequestDialog(plan)}>
              <ClipboardCheck className="w-4 h-4" /> Request Free eSIM
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!requestDialog} onOpenChange={() => setRequestDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Free eSIM</DialogTitle></DialogHeader>
          {requestDialog && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-semibold">{requestDialog.name}</p>
                <p className="text-sm text-muted-foreground">{requestDialog.dataAmount} · {requestDialog.validityDays} days · {requestDialog.country || requestDialog.region}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2"><Gift className="w-4 h-4" /> Free Service</p>
                <p className="text-xs text-emerald-700 mt-1">No payment required. Your request will be reviewed and an eSIM assigned upon approval.</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Request will be reviewed by our team</p>
                <p>• You'll be notified once approved</p>
                <p>• eSIM will be assigned and you can activate it</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialog(null)}>Cancel</Button>
            <Button onClick={() => submitRequest.mutate(requestDialog)} disabled={submitRequest.isPending} className="gap-2">
              <ClipboardCheck className="w-4 h-4" />
              {submitRequest.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
