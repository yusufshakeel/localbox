import BaseLayout from '@/layouts/BaseLayout';
import {WEBSITE_NAME} from '@/constants';
import fs from 'fs';
import path from 'path';
import {LOCALBOX_SETUP_LOCK_FILENAME} from '@/configs';
import {Pages} from '@/configs/pages';
import {resetAdminPasswordIfRequired} from '@/setup/admin-account';

export default function Home() {
  return (
    <BaseLayout pageTitle={Pages.home.title}>
      <div className="grid gap-4">
        <div className="text-center">
          <h1 className="text-5xl mt-10 mb-6">Welcome to {WEBSITE_NAME}</h1>
          <p className="text-3xl mb-5">Your personal local cloud ☁️</p>
        </div>
      </div>
    </BaseLayout>
  );
}

export async function getServerSideProps() {
  try {
    const filePath = path.join(process.cwd(), 'private', LOCALBOX_SETUP_LOCK_FILENAME);
    if (!fs.existsSync(filePath)) {
      return {
        redirect: {
          destination: '/setup'
        }
      };
    }
    await resetAdminPasswordIfRequired();
    return {props: {}};
  } catch (error: any) {
    // eslint-disable-next-line
    console.log('Something went wrong', error.message);
    return {props: {}};
  }
}