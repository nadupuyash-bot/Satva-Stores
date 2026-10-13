/**
 * Utility formatters for YASHU E-Commerce
 */

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const generateOrderNumber = (): string => {
  const prefix = 'YSH';
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
};

export const calculateDiscount = (original: number, current: number): number => {
  if (original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

export const getFutureDeliveryDate = (daysAhead: number = 3): string => {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  return target.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
