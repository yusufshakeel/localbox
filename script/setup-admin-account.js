'use strict';
import { read } from 'read';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const authFile = path.join(process.cwd(), './private/auth.json');

async function setupAdminAccount() {
  const password = await read({
    prompt: 'Creating your admin account.\nUsername: admin\nSet Password: ',
    silent: true,
    replace: '*'
  });
  const confirmPassword = await read({
    prompt: 'Confirm Password: ',
    silent: true,
    replace: '*'
  });
  if(password !== confirmPassword) {
    // eslint-disable-next-line
    console.log('Password mismatch.\nExiting...');
    process.exit(1);
  }
  const dataToWrite = {
    admins: {
      admin: {
        username: 'admin',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        createdAt: new Date().toISOString()
      }
    },
    users: {}
  };
  fs.writeFileSync(authFile, JSON.stringify(dataToWrite), 'utf8');
  // eslint-disable-next-line
  console.log('Done!');
}

setupAdminAccount();