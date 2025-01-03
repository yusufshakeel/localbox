import BaseLayout from '@/layouts/BaseLayout';
import {WEBSITE_NAME} from '@/constants';

export default function Home() {
  return (
    <BaseLayout pageTitle={'Home'}>
      <div className="grid gap-4">
        <div className="text-center">
          <h1 className="text-5xl mt-32 mb-6">Welcome to {WEBSITE_NAME}</h1>
          <p className="text-3xl mb-5">Your personal local cloud ☁️</p>
        </div>
      </div>
    </BaseLayout>
  );
}