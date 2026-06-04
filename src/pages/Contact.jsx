import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Globe, Mail, Phone, Gift } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContactSettings } from '@/hooks/useContactSettings';

export default function Contact() {
  const { toast } = useToast();
  const { businessName, supportEmail, supportPhone, isFreeMode } = useContactSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: 'We will get back to you within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">{businessName}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started Free</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </div>

        {isFreeMode && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-8">
            <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Free eSIM Approval Service</p>
              <p className="text-xs text-emerald-700">Our service is currently free. No payment is required — sign up, browse plans, and submit a request for admin approval.</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Card className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Support Email</p>
                <a href={`mailto:${supportEmail}`} className="text-sm text-primary hover:underline break-all">{supportEmail}</a>
              </div>
            </Card>
            <Card className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Support Phone</p>
                <a href={`tel:${supportPhone}`} className="text-sm text-muted-foreground hover:text-primary">{supportPhone}</a>
              </div>
            </Card>
            <Card className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Service</p>
                <p className="text-sm text-muted-foreground">Free eSIM Request & Approval</p>
              </div>
            </Card>
          </div>

          <Card className="md:col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>
      </div>

      <footer className="border-t bg-card mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{businessName}</span>
          </div>
          <p>Contact: <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a> · <a href={`tel:${supportPhone}`} className="hover:text-foreground">{supportPhone}</a></p>
        </div>
      </footer>
    </div>
  );
}