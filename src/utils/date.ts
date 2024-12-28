export const formatDate = (timestamp: number): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  return new Date(timestamp).toLocaleString('en-GB', options).replace(',', '');
};

export const getISOStringDate = () => new Date().toISOString();