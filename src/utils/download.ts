export function handleDownload(directory: string, filename: string) {
  const link = document.createElement('a');
  link.href = `/${directory}/${filename}`;
  link.download = filename;
  link.click();
}