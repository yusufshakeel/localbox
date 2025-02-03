const options: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};

export const formatDate = (timestamp?: number | string): string => {
  let date: number;
  if (typeof timestamp === 'string') {
    if (/^\d+$/.test(timestamp)) {
      date = new Date(+timestamp as number) as unknown as number;
    } else {
      date = new Date(timestamp as any) as unknown as number;
    }
  } else {
    date = new Date(timestamp as any) as unknown as number;
  }
  if (isNaN(date)) {
    return '';
  }
  return date.toLocaleString('en-GB', options).replace(',', '');
};

export const getISOStringDate =
  (timestamp?: number | string | Date) =>
    timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

export const getEpochTimestampInMilliseconds =
  (timestamp: string | Date) => new Date(timestamp).getTime();