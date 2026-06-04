import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Smartphone, ClipboardList, TicketCheck, Zap, Globe, CheckCircle2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(230,70%,52%)', 'hsl(168,60%,42%)', 'hsl(38,92%,50%)', 'hsl(280,60%,55%)', 'hsl(0,72%,51%)'];

export default function AdminDashboard({ user }) {
  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: () => base44.entities.User.list() });
  const { data: esims = [] } = useQuery({ queryKey: ['all-esims'], queryFn: () => base44.entities.Esim.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['all-orders'], queryFn: () => base44.entities.Order.list() });
  const { data: tickets = [] } = useQuery({ queryKey: ['all-tickets'], queryFn: () => base44.entities.SupportTicket.list() });
  const { data: activations = [] } = useQuery({ queryKey: ['all-activations'], queryFn: () => base44.entities.Activation.list() });

  const customers = users.filter(u => u.role === 'customer');
  const pendingRequests = orders.filter(o => ['pending', 'pending_review', 'pending_approval', 'processing'].includes(o.status));
  const approvedRequests = orders.filter(o => ['approved', 'assigned', 'activated', 'completed'].includes(o.status));
  const availableEsims = esims.filter(e => e.status === 'available');

  const esimStatusData = ['available', 'assigned', 'activated', 'expired'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: esims.filter(e => e.status === s).length,
  })).filter(d => d.value > 0);

  const requestStatusData = [
    { name: 'Pending', count: pendingRequests.length },
    { name: 'Approved', count: approvedRequests.length },
    { name: 'Rejected', count: orders.filter(o => o.status === 'rejected').length },
    { name: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Free eSIM service — request approvals and platform overview" />

      {/* Free service mode notice */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-sm text-emerald-800"><span className="font-semibold">Free Approval Mode Active</span> — Payments are disabled. Customers submit requests; admins approve and assign eSIMs.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="primary" />
        <StatCard title="Total Requests" value={orders.length} icon={ClipboardList} color="accent" />
        <StatCard title="Active eSIMs" value={esims.filter(e => e.status === 'activated').length} icon={Smartphone} color="indigo" />
        <StatCard title="Open Tickets" value={tickets.filter(t => ['open', 'in_progress'].includes(t.status)).length} icon={TicketCheck} color="warning" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Approval" value={pendingRequests.length} icon={Clock} color="warning" />
        <StatCard title="Approved Requests" value={approvedRequests.length} icon={CheckCircle2} color="accent" />
        <StatCard title="Available eSIMs" value={availableEsims.length} icon={Globe} color="purple" />
        <StatCard title="Pending Activations" value={activations.filter(a => a.status === 'pending').length} icon={Zap} color="danger" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Request Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={requestStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,88%)" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(230,70%,52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">eSIM Inventory Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={esimStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {esimStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Pending Requests</h3>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{o.planName || 'Unknown Plan'}</p>
                    <p className="text-xs text-muted-foreground">{o.userName} · {o.orderNumber}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Support Tickets</h3>
          <div className="space-y-3">
            {tickets.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.userName}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}