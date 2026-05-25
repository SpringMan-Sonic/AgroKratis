export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const LANGUAGES = {
  te: { name: 'Telugu', code: 'te', nativeName: 'Telugu' },
  hi: { name: 'Hindi', code: 'hi', nativeName: 'Hindi' },
  ta: { name: 'Tamil', code: 'ta', nativeName: 'Tamil' },
  ml: { name: 'Malayalam', code: 'ml', nativeName: 'Malayalam' },
  kn: { name: 'Kannada', code: 'kn', nativeName: 'Kannada' }
};

export const TABS = {
  SEEDS: 'seeds',
  ORDERS: 'orders',
  RATION_CARDS: 'ration'
};

export const STOCK_STATUS = {
  HIGH: { min: 2000, label: 'In Stock', color: 'green' },
  MEDIUM: { min: 1000, label: 'Medium', color: 'yellow' },
  LOW: { min: 0, label: 'Low Stock', color: 'red' }
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export const RATION_CARD_VALIDITY_DAYS = 30;

export const TOAST_DURATION = 3000;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};