import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import {Button} from '@/components/ui/button';
import {Home} from 'lucide-react';
import {Pages} from '@/configs/pages';

export default function PageNotFound() {
  return (
    <BaseLayout pageTitle={'Page Not Found'}>
      <div className="grid gap-4">
        <h1 className="text-5xl">Page not found</h1>
        <div>
          <Link href={Pages.home.link}>
            <Button variant="secondary">
              <Home/> Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
}
