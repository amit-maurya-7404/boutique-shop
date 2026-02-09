/**
 * WhatsApp Button – Modern CTA
 */

'use client';

import React from 'react';
import { generateWhatsAppLink } from '@/lib/utils';

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  variant?: 'primary' | 'outline';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  className = '',
  variant = 'primary',
}) => {
  const whatsappLink = generateWhatsAppLink(message);

  const baseStyles =
    'group inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 active:scale-[0.97]';

  const variantStyles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40'
      : 'border border-green-500 text-green-600 bg-white hover:bg-green-50';

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.07 0C5.52 0 .007 4.486.007 10.007c0 1.966.568 3.812 1.548 5.35L0 20.207l4.97-1.55a9.93 9.93 0 005.1 1.35c5.522 0 10.007-4.486 10.007-10.007C20.077 4.486 15.592 0 12.07 0z" />
      </svg>

      <span className="relative">
        Enquire on WhatsApp
        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
      </span>
    </a>
  );
};
