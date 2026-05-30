import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Returns resolved contact/business settings from SystemSetting entity.
 * Falls back to placeholder values if not yet configured.
 */
export function useContactSettings() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.SystemSetting.list(),
  });

  const get = (key, fallback = '') =>
    settings.find(s => s.key === key)?.value || fallback;

  return {
    isLoading,
    businessName: get('business_name', 'eSIM Pro'),
    supportEmail: get('support_email', 'support@esimpro.com'),
    adminEmail: get('admin_email', 'admin@yourdomain.com'),
    supportPhone: get('support_phone', '+1 (888) 000-0000'),
    supportInstructions: get('support_instructions', 'Submit a ticket below or email us directly. We aim to respond within 24 hours on business days.'),
    serviceMode: get('service_mode', 'free_approval'),
    isFreeMode: get('service_mode', 'free_approval') === 'free_approval',
  };
}