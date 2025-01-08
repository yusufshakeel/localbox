import {Home} from 'lucide-react';
import BaseLayout from '@/layouts/BaseLayout';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <BaseLayout pageTitle={'Home'}>
      <div className="grid gap-4">
        <h1 className="text-4xl text-destructive flex items-center space-x-2">
          Unauthorized!
        </h1>
        <p>You do not have permissions.</p>
        <div>
          <Link href="/">
            <Button variant="secondary">
              <Home/> Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
}