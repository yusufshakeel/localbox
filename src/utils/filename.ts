const commonReplacer = (fileName: string) => {
  // remove timestamp part when file name is like 1733659240385-hello-world.txt
  if (/^\d{10,}-.*$/gi.test(fileName)) {
    fileName = fileName.replace(/^\d{10,}-/gi,'');
  }
  // remove timestamp part when file name is like 2024-12-08T12:01:42.922Z-hello-world.txt
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-.*$/gi.test(fileName)) {
    fileName = fileName.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-/gi,'');
  }

  return fileName;
};

export function getFilename(filenameWithTimestampPrefix: string) {
  let fileName = commonReplacer(filenameWithTimestampPrefix);

  if (/^__[a-zA-Z0-9]+__-.*$/gi.test(fileName)) {
    fileName = fileName.replace(/^__[a-zA-Z0-9]+__-/gi, '');
  }

  return fileName;
}

export function getUsernameFromFilename(filenameWithTimestampPrefix: string) {
  const fileName = commonReplacer(filenameWithTimestampPrefix);

  if (/^__[a-zA-Z0-9]+__-.*$/gi.test(fileName)) {
    return fileName.split('__')[1];
  }

  return '';
}