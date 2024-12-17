'use strict';
import { read } from 'read';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const authFile = path.join(process.cwd(), './private/auth.json');

async function setupAdminAccount() {
  const password = await read({
    prompt: 'Set Admin Password: ',
    silent: true,
    replace: '*'
  });
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
}

setupAdminAccount();