'use strict';
import fs from 'fs';
import path from 'path';
import {createHash} from 'crypto';

function setupEnvFile() {
  const envExampleFile = path.join(process.cwd(), './.env.example');
  const envFile = path.join(process.cwd(), './.env');

  if (!fs.existsSync(envExampleFile)) {
    // eslint-disable-next-line
    console.log('Cannot find .env.example file. Aborting...\n');
    process.exit(1);
  }
  if (fs.existsSync(envFile)) {
    // eslint-disable-next-line
    console.log('Found an .env file.\nSkipping .env file creation.\nYou have to manually update it.');
  }

  const template = fs.readFileSync(envExampleFile).toString();
  const dataToWrite = template.replace(
    new RegExp(`\{\{JWT_SECRET\}\}`, 'g'),
    createHash('sha256').update(`${Math.random()}:${Date.now()}`).digest('hex')
  );
  fs.writeFileSync(envFile, dataToWrite, 'utf8');
}

setupEnvFile();