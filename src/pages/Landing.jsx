import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, Zap, Shield, Headphones, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { useContactSettings } from '@/hooks/useContactSettings';

const features = [
  { icon: Globe, title: 'Plan Catalog', desc: 'Browse regional and global plans currently listed by our team.' },
  { icon: Zap, title: 'Managed Activation', desc: 'Receive provider-issued installation details after approval and inventory assignment.' },
  { icon: Shield, title: 'Controlled Delivery', desc: 'Account roles and approval checks protect eSIM assignment details.' },
  { icon: Headphones, title: 'Support Portal', desc: 'Open and track support tickets from your dashboard.' },
];

const highlights = [
  'No physical SIM required',
  'Works on all eSIM devices',
  'Flexible data plans',
  'Provider-issued QR delivery',
  'Manage from anywhere',
  'Multi-device support',
];

export default function Landing() {
  const { businessName, supportEmail, supportPhone } = useContactSettings();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">GEM eSIM</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/explore-plans">
              <Button variant="ghost" size="sm">Plans</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Wifi className="w-3.5 h-3.5" />
              <span>Next-Gen Connectivity</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Stay Connected<br />
              <span className="text-primary">Everywhere You Go</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Approval-based eSIM management. Submit a request, then receive installation details when a matching provider-issued eSIM is available and assigned.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-8">
                  Request Free eSIM <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/explore-plans">
                <Button variant="outline" size="lg" className="text-base px-8">View Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['8', 'Plan Options'],
            ['3', 'Managed Roles'],
            ['$0', 'Checkout Today'],
            ['1', 'Approval Workflow'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-primary">{val}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Choose GEM eSIM?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to manage your connectivity in one platform.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <Card key={f.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-card border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Everything in Your Pocket</h2>
              <p className="text-muted-foreground mb-6">Manage all your eSIMs, plans, and activations from a single dashboard. No more juggling physical cards.</p>
              <div className="grid grid-cols-2 gap-3">
                {highlights.map(h => (
                  <div key={h} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 flex items-center justify-center h-64">
              <div className="text-center">
                <Globe className="w-16 h-16 text-primary mx-auto mb-3 opacity-60" />
                <p className="text-sm text-muted-foreground">Interactive eSIM Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to Get Connected — For Free?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Sign up, browse the catalog, and submit a request. Approval and delivery depend on matching provider inventory.</p>
        <Link to="/register">
          <Button size="lg" className="gap-2 text-base px-10">
            Request Your Free eSIM <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{businessName}</span>
          </div>
          <p>
            <a href={`mailto:${supportEmail}`} className="hover:text-primary">{supportEmail}</a>
            {supportPhone && <> · <a href={`tel:${supportPhone}`} className="hover:text-foreground">{supportPhone}</a></>}
          </p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/explore-plans" className="hover:text-foreground">Plans</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
