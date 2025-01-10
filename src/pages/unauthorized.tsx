import {Home} from 'lucide-react';
import BaseLayout from '@/layouts/BaseLayout';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Pages} from '@/configs/pages';

export default function UnauthorizedPage() {
  return (
    <BaseLayout pageTitle={Pages.unauthorized.title}>
      <div className="grid gap-4">
        <h1 className="text-4xl text-destructive flex items-center space-x-2">
          Unauthorized!
        </h1>
        <p>Contact the Admin to grant you the necessary permissions.</p>
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