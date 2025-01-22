import BaseLayout from '@/layouts/BaseLayout';
import path from 'path';
import fs from 'fs';
import {initDbCollections} from '@/setup/db-collections';
import {setupAdminAccount} from '@/setup/admin-account';
import {setupEnvFile} from '@/setup/env-file';
import {LOCALBOX_SETUP_LOCK_FILENAME} from '@/configs';
import {Button} from '@/components/ui/button';
import {Home} from 'lucide-react';
import Link from 'next/link';
import {getISOStringDate} from '@/utils/date';
import {setupPages} from '@/setup/pages';
import {Pages} from '@/configs/pages';
import {setupConfigs} from '@/setup/configs';

export default function Setup(props: any) {
  const  pageTitle = Pages.setup.title;

  if(props.errorMessage) {
    return (
      <BaseLayout pageTitle={pageTitle} isSetupPage={true}>
        <div className="grid gap-4">
          <h1 className="text-4xl text-destructive">Setup failed!</h1>
          <pre>{props.errorMessage}</pre>
          <p>Check logs.</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout pageTitle={pageTitle} isSetupPage={true}>
      <div className="grid gap-4">
        <h1 className="text-3xl">Setup</h1>

        <h2 className="text-2xl"><code>.env</code> file created</h2>
        <div>File path: <span>{props.envFilePath}</span></div>

        <h2 className="text-2xl">Database collections</h2>
        <div>{props.dbCollections?.map((v: string) => <p key={v}>{v}</p>)}</div>

        <h2 className="text-2xl">Pages</h2>
        <div>
          {
            props.pages?.map((v: { link: string, title: string }) =>
              <p key={v.link}>{v.title}</p>)
          }
        </div>

        <h2 className="text-2xl">Admin account created</h2>
        <div>
          <p>username: {props.adminUser?.username}</p>
          <p>password: {props.adminUser?.password}</p>
          <p>You can change the password after logging in.</p>
        </div>

        <p>Done!</p>

        <p>Restart the server.</p>

        <Link href={Pages.home.link}>
          <Button variant="secondary">
            <Home/> Go to Home
          </Button>
        </Link>
      </div>
    </BaseLayout>
  );
}

export function getServerSideProps() {
  try {
    const filePath = path.join(process.cwd(), 'private', LOCALBOX_SETUP_LOCK_FILENAME);
    if (fs.existsSync(filePath)) {
      return {
        redirect: {
          destination: '/'
        }
      };
    }

    const {envFilePath} = setupEnvFile();
    const {dbCollections} = initDbCollections();
    const adminUser = setupAdminAccount();
    const pages = setupPages();
    const configs = setupConfigs();

    fs.writeFileSync(filePath, `Last updated at: ${getISOStringDate()}`, 'utf8');

    return {
      props: {
        dbCollections,
        adminUser,
        envFilePath,
        pages,
        configs
      }
    };
  } catch (error: any) {
    return {
      props: {
        errorMessage: error.message
      }
    };
  }
}