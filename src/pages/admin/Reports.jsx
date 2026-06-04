import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Users, DollarSign, Smartphone, ShoppingCart, TicketCheck, Zap, Package, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(230,70%,52%)', 'hsl(168,60%,42%)', 'hsl(38,92%,50%)', 'hsl(280,60%,55%)', 'hsl(0,72%,51%)', 'hsl(200,60%,50%)'];

export default function Reports() {
  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: () => base44.entities.User.list() });
  const { data: esims = [] } = useQuery({ queryKey: ['all-esims'], queryFn: () => base44.entities.Esim.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['all-orders'], queryFn: () => base44.entities.Order.list() });
  const { data: payments = [] } = useQuery({ queryKey: ['all-payments'], queryFn: () => base44.entities.Payment.list() });
  const { data: tickets = [] } = useQuery({ queryKey: ['all-tickets'], queryFn: () => base44.entities.SupportTicket.list() });
  const { data: activations = [] } = useQuery({ queryKey: ['all-activations'], queryFn: () => base44.entities.Activation.list() });
  const { data: plans = [] } = useQuery({ queryKey: ['all-plans'], queryFn: () => base44.entities.Plan.list() });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);
  const customers = users.filter(u => u.role === 'customer');

  const planPerformance = plans.map(p => ({
    name: p.name?.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
    orders: orders.filter(o => o.planId === p.id || o.planName === p.name).length,
    revenue: orders.filter(o => o.planId === p.id || o.planName === p.name).reduce((s, o) => s + (o.amount || 0), 0),
  })).filter(p => p.orders > 0);

  const ticketByCategory = ['activation', 'billing', 'technical', 'account', 'general'].map(c => ({
    name: c.charAt(0).toUpperCase() + c.slice(1),
    value: tickets.filter(t => t.category === c).length,
  })).filter(d => d.value > 0);

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Business metrics and performance" />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="primary" />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="accent" />
        <StatCard title="Active eSIMs" value={esims.filter(e => e.status === 'activated').length} icon={Smartphone} color="indigo" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="purple" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Activations" value={activations.filter(a => a.status === 'pending').length} icon={Zap} color="warning" />
        <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open').length} icon={TicketCheck} color="danger" />
        <StatCard title="eSIM Inventory" value={esims.filter(e => e.status === 'available').length} icon={Package} color="primary" />
        <StatCard title="Active Plans" value={plans.filter(p => p.status === 'active').length} icon={Globe} color="accent" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Plan Performance</h3>
          {planPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={planPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,88%)" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(230,70%,52%)" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No plan data yet</p>}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tickets by Category</h3>
          {ticketByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={ticketByCategory} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {ticketByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No ticket data yet</p>}
        </Card>
      </div>
    </div>
  );
}