'use strict';
import { read } from 'read';
import fs from 'fs';
import fsExtra from 'fs-extra';
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

  let existingFileContent = {};
  if (fs.existsSync(authFile)) {
    try {
      existingFileContent = fsExtra.readJSONSync(authFile);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // do nothing...
    }
  }
  const dataToWrite = existingFileContent?.admins
    ? {
      admins: {
        ...existingFileContent.admins,
        admin: {
          username: 'admin',
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          createdAt: new Date().toISOString()
        }
      },
      users: existingFileContent?.users || {}
    }
    : {
      admins: {
        admin: {
          username: 'admin',
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          createdAt: new Date().toISOString()
        }
      },
      users: existingFileContent?.users || {}
    };
  fsExtra.writeJSONSync(authFile, dataToWrite, 'utf8');
  // eslint-disable-next-line
  console.log('Done!');
}

setupAdminAccount();