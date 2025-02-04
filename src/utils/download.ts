import {getFilename} from '@/utils/filename';

export function handleDownload(directory: string, filename: string) {
  const link = document.createElement('a');
  link.href = `/api/files?downloadFilename=${filename}&dir=${directory}`;
  link.download = getFilename(filename);
  link.click();
}

export function handlePersonalDriveDownload(filename: string) {
  const link = document.createElement('a');
  link.href = `/api/personal-drive?downloadFilename=${filename}`;
  link.download = getFilename(filename);
  link.click();
}