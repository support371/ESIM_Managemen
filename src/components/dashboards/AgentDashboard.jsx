import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, ShoppingCart, TicketCheck, Wallet } from 'lucide-react';

export default function AgentDashboard({ user }) {
  const { data: customers = [] } = useQuery({
    queryKey: ['agent-customers'],
    queryFn: () => base44.entities.User.filter({ assignedAgentId: user?.id }),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ['agent-tickets'],
    queryFn: () => base44.entities.SupportTicket.filter({ assignedTo: user?.id }),
  });
  const { data: commissions = [] } = useQuery({
    queryKey: ['agent-commissions'],
    queryFn: () => base44.entities.Commission.filter({ agentId: user?.id }),
  });

  const totalCommission = commissions.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div>
      <PageHeader title={`Agent Dashboard`} description={`Welcome back, ${user?.full_name || 'Agent'}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="My Customers" value={customers.length} icon={Users} color="primary" />
        <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open').length} icon={TicketCheck} color="warning" />
        <StatCard title="Total Commissions" value={`$${totalCommission.toFixed(2)}`} icon={Wallet} color="accent" />
        <StatCard title="Pending Payouts" value={commissions.filter(c => c.status === 'pending').length} icon={ShoppingCart} color="purple" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Customers</h3>
          {customers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assigned customers yet.</p>
          ) : (
            <div className="space-y-3">
              {customers.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <StatusBadge status={c.status || 'active'} />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Open Tickets</h3>
          {tickets.filter(t => t.status === 'open').length === 0 ? (
            <p className="text-sm text-muted-foreground">No open tickets.</p>
          ) : (
            <div className="space-y-3">
              {tickets.filter(t => t.status === 'open').slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.userName}</p>
                  </div>
                  <StatusBadge status={t.priority} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}