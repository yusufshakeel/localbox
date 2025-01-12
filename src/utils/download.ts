import {getFilename} from '@/utils/filename';

export function handleDownload(directory: string, filename: string) {
  const link = document.createElement('a');
  link.href = `/${directory}/${filename}`;
  link.download = getFilename(filename);
  link.click();
}