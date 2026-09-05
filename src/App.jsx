import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleRoute from '@/components/RoleRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Public pages
import Landing from '@/pages/Landing';
import ExplorePlans from '@/pages/ExplorePlans';
import Contact from '@/pages/Contact';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Dashboard
import Dashboard from '@/pages/Dashboard';

// Customer pages
import BrowsePlans from '@/pages/customer/BrowsePlans';
import MyEsims from '@/pages/customer/MyEsims';
import MyOrders from '@/pages/customer/MyOrders';
import MyPayments from '@/pages/customer/MyPayments';
import MyActivations from '@/pages/customer/MyActivations';
import Support from '@/pages/customer/Support';
import Profile from '@/pages/customer/Profile';

// Agent pages
import AgentCustomers from '@/pages/agent/AgentCustomers';
import AgentOrders from '@/pages/agent/AgentOrders';
import AgentEsims from '@/pages/agent/AgentEsims';
import AgentTickets from '@/pages/agent/AgentTickets';
import AgentCommissions from '@/pages/agent/AgentCommissions';

// Admin pages
import Customers from '@/pages/admin/Customers';
import Agents from '@/pages/admin/Agents';
import EsimInventory from '@/pages/admin/EsimInventory';
import Plans from '@/pages/admin/Plans';
import Orders from '@/pages/admin/Orders';
import Payments from '@/pages/admin/Payments';
import Activations from '@/pages/admin/Activations';
import Tickets from '@/pages/admin/Tickets';
import Reports from '@/pages/admin/Reports';
import AuditLogs from '@/pages/admin/AuditLogs';
import Settings from '@/pages/admin/Settings';
import UserManagement from '@/pages/admin/UserManagement';

const LayoutWrapper = () => {
  const { user } = useAuth();
  return <AppLayout user={user} />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/explore-plans" element={<ExplorePlans />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<LayoutWrapper />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Customer pages */}
          <Route path="/plans" element={<BrowsePlans />} />
          <Route path="/my-esims" element={<MyEsims />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-payments" element={<MyPayments />} />
          <Route path="/my-activations" element={<MyActivations />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />

          {/* Agent pages */}
          <Route element={<RoleRoute minRole="agent" />}>
            <Route path="/agent/customers" element={<AgentCustomers />} />
            <Route path="/agent/orders" element={<AgentOrders />} />
            <Route path="/agent/esims" element={<AgentEsims />} />
            <Route path="/agent/tickets" element={<AgentTickets />} />
            <Route path="/agent/commissions" element={<AgentCommissions />} />
          </Route>

          {/* Admin pages */}
          <Route element={<RoleRoute minRole="admin" />}>
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/esims" element={<EsimInventory />} />
            <Route path="/admin/plans" element={<Plans />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/activations" element={<Activations />} />
            <Route path="/admin/tickets" element={<Tickets />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={['super_admin']} />}>
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
