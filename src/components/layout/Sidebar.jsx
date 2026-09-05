import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isAdmin, isSuperAdmin, isAgent, formatRole } from '@/lib/roleUtils';
import {
  LayoutDashboard, Globe, ShoppingCart, Smartphone,
  TicketCheck, Users, Package, Settings, FileText,
  ChevronLeft, ChevronRight, LogOut, Shield,
  BarChart3, UserCog, Wallet, Zap, Menu, X
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const customerNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Browse Plans', path: '/plans', icon: Globe },
  { label: 'My eSIMs', path: '/my-esims', icon: Smartphone },
  { label: 'My Requests', path: '/my-orders', icon: ShoppingCart },
  { label: 'My Activations', path: '/my-activations', icon: Zap },
  { label: 'Support', path: '/support', icon: TicketCheck },
  { label: 'Profile', path: '/profile', icon: UserCog },
];

const agentNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Customers', path: '/agent/customers', icon: Users },
  { label: 'Customer Requests', path: '/agent/orders', icon: ShoppingCart },
  { label: 'eSIM Assignments', path: '/agent/esims', icon: Smartphone },
  { label: 'Support Tickets', path: '/agent/tickets', icon: TicketCheck },
  { label: 'Commissions', path: '/agent/commissions', icon: Wallet },
  { label: 'Profile', path: '/profile', icon: UserCog },
];

const adminNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Agents', path: '/admin/agents', icon: Shield },
  { label: 'eSIM Inventory', path: '/admin/esims', icon: Smartphone },
  { label: 'Plans', path: '/admin/plans', icon: Package },
  { label: 'eSIM Requests', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Activations', path: '/admin/activations', icon: Zap },
  { label: 'Support Tickets', path: '/admin/tickets', icon: TicketCheck },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const superAdminNav = [
  ...adminNav,
  { label: 'User Management', path: '/admin/users', icon: UserCog },
];

export default function Sidebar({ user }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = user?.role || 'customer';

  let nav = customerNav;
  if (isSuperAdmin(role)) nav = superAdminNav;
  else if (isAdmin(role)) nav = adminNav;
  else if (isAgent(role)) nav = agentNav;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-sidebar-foreground tracking-tight">GEM eSIM</span>}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {nav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.full_name || 'User'}</p>
            <p className="text-xs text-sidebar-foreground/50">{formatRole(role)}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => base44.auth.logout('/')}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-sidebar transition-all ${collapsed ? 'w-16' : 'w-60'}`}>
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
