import React from 'react';
import { getStatusBadgeColor, formatStatus } from '@/lib/roleUtils';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(status)} ${className}`}>
      {formatStatus(status)}
    </span>
  );
}