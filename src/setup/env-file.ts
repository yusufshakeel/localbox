import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export function setupEnvFile() {
  const filePath = path.join(process.cwd(), '.env');

  let fileContent = '';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const lines = fileContent.split('\n');

  let isAuthSecretSet = false;
  const authSecret = `AUTH_SECRET=${crypto.randomBytes(32).toString('base64')}`;

  const updatedFileContent = lines.filter(l => l.length).map(line => {
    const [key, value] = line.split('=');

    if (key === 'AUTH_SECRET') {
      isAuthSecretSet = true;
      return authSecret;
    }

    return `${key.trim()}=${value.trim()}`;
  });

  if (!isAuthSecretSet) {
    updatedFileContent.push(authSecret);
  }

  fs.writeFileSync(filePath, updatedFileContent.join('\n'), 'utf8');

  return {
    envFilePath: filePath
  };
}