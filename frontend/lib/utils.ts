/**
 * Utility helper functions
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (original: number, discounted: number): number => {
  return Math.round(((original - discounted) / original) * 100);
};

export const generateWhatsAppLink = (message: string): string => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919137290903';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const clsx = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
