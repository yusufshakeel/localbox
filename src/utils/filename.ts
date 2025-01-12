const filenameWithTimestampPrefixRegex = /^\d{10,}-.*$/i;
const timestampPrefixRegex = /^\d{10,}-/i;
const filenameWithTimestampISOStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-.*$/i;
const timestampISOStringPrefixRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-/i;
const filenameWithUsernameRegex = /^__[a-zA-Z0-9]+__-.*$/i;
const usernameRegex = /^__[a-zA-Z0-9]+__-/i;

const commonReplacer = (fileName: string) => {
  // remove timestamp part when file name is like 1733659240385-hello-world.txt
  if (filenameWithTimestampPrefixRegex.test(fileName)) {
    fileName = fileName.replace(timestampPrefixRegex,'');
  }
  // remove timestamp part when file name is like 2024-12-08T12:01:42.922Z-hello-world.txt
  else if (filenameWithTimestampISOStringRegex.test(fileName)) {
    fileName = fileName.replace(timestampISOStringPrefixRegex,'');
  }

  return fileName;
};

export function getFilename(filenameWithTimestampPrefix: string) {
  let fileName = commonReplacer(filenameWithTimestampPrefix);

  if (filenameWithUsernameRegex.test(fileName)) {
    fileName = fileName.replace(usernameRegex, '');
  }

  return fileName;
}

export function getUsernameFromFilename(filenameWithTimestampPrefix: string) {
  const fileName = commonReplacer(filenameWithTimestampPrefix);

  if (filenameWithUsernameRegex.test(fileName)) {
    return fileName.split('__')[1];
  }

  return '';
}

export function getTimestampFromFilename(filenameWithTimestampPrefix: string) {
  // file name is like 1733659240385-hello-world.txt
  if (filenameWithTimestampPrefixRegex.test(filenameWithTimestampPrefix)) {
    return filenameWithTimestampPrefix.split('-')[0];
  }

  // file name is like 2024-12-08T12:01:42.922Z-hello-world.txt
  if (filenameWithTimestampISOStringRegex.test(filenameWithTimestampPrefix)) {
    return filenameWithTimestampPrefix.split(/Z-(.+)/)[0] + 'Z';
  }

  return '';
}