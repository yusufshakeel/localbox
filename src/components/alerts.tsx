import { AlertCircle } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';

export function AlertError({ message }: {message: string}) {
  return (
    <Alert variant="destructive" className="text-red-800 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
