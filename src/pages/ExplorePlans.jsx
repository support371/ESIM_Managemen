import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Globe, CheckCircle, ArrowRight, Star, Gift, ClipboardCheck } from 'lucide-react';

export default function ExplorePlans() {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['public-plans'],
    queryFn: () => base44.entities.Plan.filter({ status: 'active' }),
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">GEM eSIM</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started Free</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-6">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <Gift className="w-3.5 h-3.5 mr-1" /> Free Service — No Payment Required
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Free eSIM Plans</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Browse the current plan catalog. Requests are reviewed manually and fulfilled only when matching provider-issued inventory is available.</p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-10 max-w-2xl mx-auto">
          <ClipboardCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">How it works</p>
            <p className="text-xs text-emerald-700">Sign up → Browse plans → Submit a request → Admin review → Matching inventory assigned → Install from your dashboard</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-5 bg-muted rounded w-2/3 mb-4" />
                <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map(plan => (
              <Card key={plan.id} className={`p-6 relative hover:shadow-lg transition-all ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground gap-1"><Star className="w-3 h-3" /> Popular</Badge>
                  </div>
                )}
                <div className="mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{plan.country || plan.region}</p>
                  <h3 className="text-lg font-bold mt-1">{plan.name}</h3>
                </div>
                <Badge variant="outline" className="mb-3 text-emerald-700 border-emerald-300 bg-emerald-50 font-semibold text-sm">
                  FREE
                </Badge>
                <p className="text-xs text-muted-foreground mb-3">Approval required · No payment</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{plan.dataAmount} data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{plan.validityDays} days validity</span>
                  </div>
                  {plan.features?.slice(0, 2).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register">
                  <Button className="w-full gap-1" variant={plan.popular ? 'default' : 'outline'}>
                    Request Free eSIM <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
