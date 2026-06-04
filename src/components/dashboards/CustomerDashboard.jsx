import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { Smartphone, ClipboardList, TicketCheck, Globe, ArrowRight, Gift } from 'lucide-react';

export default function CustomerDashboard({ user }) {
  const { data: esims = [] } = useQuery({
    queryKey: ['my-esims'],
    queryFn: () => base44.entities.Esim.filter({ assignedUserId: user?.id }),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => base44.entities.Order.filter({ userId: user?.id }),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => base44.entities.SupportTicket.filter({ userId: user?.id }),
  });

  const pendingRequests = orders.filter(o => ['pending', 'pending_review', 'pending_approval', 'processing'].includes(o.status));
  const approvedRequests = orders.filter(o => ['approved', 'assigned', 'activated', 'completed'].includes(o.status));

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'User'}`}
        description="Here's an overview of your free eSIM service account."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="My eSIMs" value={esims.length} icon={Smartphone} color="primary" />
        <StatCard title="My Requests" value={orders.length} icon={ClipboardList} color="accent" />
        <StatCard title="Active eSIMs" value={esims.filter(e => e.status === 'activated').length} icon={Globe} color="indigo" />
        <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open').length} icon={TicketCheck} color="warning" />
      </div>

      {/* Request status summary */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <p className="text-xl font-bold text-amber-700">{pendingRequests.length}</p>
            <p className="text-xs text-amber-600 font-medium">Pending Approval</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-xl font-bold text-emerald-700">{approvedRequests.length}</p>
            <p className="text-xs text-emerald-600 font-medium">Approved / Active</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
            <p className="text-xl font-bold text-red-700">{orders.filter(o => o.status === 'rejected').length}</p>
            <p className="text-xs text-red-600 font-medium">Rejected</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">My eSIMs</h3>
            <Link to="/my-esims"><Button variant="ghost" size="sm">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          {esims.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No eSIMs yet. Submit a request to get started.</p>
          ) : (
            <div className="space-y-3">
              {esims.slice(0, 4).map(esim => (
                <div key={esim.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{esim.planName || esim.iccid}</p>
                    <p className="text-xs text-muted-foreground">ICCID: {esim.iccid}</p>
                  </div>
                  <StatusBadge status={esim.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Requests</h3>
            <Link to="/my-orders"><Button variant="ghost" size="sm">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{order.planName}</p>
                    <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-primary/5 border-emerald-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Request a Free eSIM</h3>
              <p className="text-sm text-muted-foreground">Browse our plans and submit a free request — no payment needed.</p>
            </div>
          </div>
          <Link to="/plans">
            <Button className="gap-2 whitespace-nowrap">Browse Plans <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}