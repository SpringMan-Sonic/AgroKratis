export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatWeight = (grams) => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${grams} g`;
};

export const formatRationCard = (number) => {
  // Format: RC0001
  if (!number) return 'N/A';
  return number.toUpperCase();
};

export const formatAadhaar = (number) => {
  // Format: XXXX XXXX XXXX
  if (!number) return 'N/A';
  const str = number.toString();
  return str.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

export const formatPhone = (number) => {
  // Format: +91 XXXXX XXXXX
  if (!number) return 'N/A';
  const str = number.toString().replace(/\D/g, '');
  if (str.length === 10) {
    return `+91 ${str.slice(0, 5)} ${str.slice(5)}`;
  }
  return number;
};

export const getStockStatus = (stock) => {
  if (stock >= 2000) return { label: 'In Stock', color: 'green' };
  if (stock >= 1000) return { label: 'Medium', color: 'yellow' };
  return { label: 'Low Stock', color: 'red' };
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const calculateDaysRemaining = (lastUsedDate) => {
  if (!lastUsedDate) return 30;
  
  const lastUsed = new Date(lastUsedDate);
  const now = new Date();
  const diffTime = now - lastUsed;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 30 - diffDays);
};

export const getLanguageName = (code) => {
  const languages = {
    te: 'Telugu',
    hi: 'Hindi',
    ta: 'Tamil',
    ml: 'Malayalam',
    kn: 'Kannada'
  };
  return languages[code] || code.toUpperCase();
};
