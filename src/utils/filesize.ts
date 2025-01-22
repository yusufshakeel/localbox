export function humanReadableFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 Bytes';
  else if (sizeInBytes === 1) return '1 Byte';

  const k = 1000; // Define the base for kilobytes
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // Unit labels
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k)); // Determine the unit index

  // Format the number with the specified decimal places
  const readableSize = parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(3));
  return `${readableSize} ${sizes[i]}`;
}