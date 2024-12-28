'use strict';
import { read } from 'read';
import bcrypt from 'bcrypt';
import {minivium, SchemaRegistry} from 'minivium';
import path from 'path';

const db = minivium({
  dataDir: path.join(process.cwd(), 'private/db'),
  schemaRegistry: new SchemaRegistry({
    collections: [
      {
        name: 'auth',
        columns: [
          { name: 'id', isUnique: true },
          { name: 'username', isRequired: true, isUnique: true },
          { name: 'password', isRequired: true },
          { name: 'accountType', isRequired: true },
          { name: 'accountStatus', isRequired: true },
          { name: 'rbac', isRequired: true },
          { name: 'createdAt', isRequired: true },
          { name: 'updatedAt', isRequired: true }
        ]
      }
    ]
  })
});

async function setupAdminAccount() {
  db.init();

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

  const data = {
    username: 'admin',
    accountType: 'admin',
    accountStatus: 'active',
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    rbac: {
      role: 'admin',
      permissions: ['create:*', 'view:*', 'update:*', 'delete:*']
    }
  };
  const where = {
    username: 'admin',
    accountType: 'admin',
    accountStatus: 'active'
  };

  const adminAccount = db.query.select('auth', { where });
  if (adminAccount.length) {
    db.query.update(
      'auth',
      {
        ...data,
        updatedAt: new Date().toISOString()
      },
      { where }
    );
  } else {
    db.query.insert(
      'auth',
      {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  }

  // eslint-disable-next-line
  console.log('Created admin account.');
}

setupAdminAccount();