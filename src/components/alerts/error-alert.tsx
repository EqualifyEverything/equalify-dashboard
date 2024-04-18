import { forwardRef } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '.';

interface ErrorAlertProps {
  error: string;
  className?: string;
}

const ErrorAlert = forwardRef<HTMLDivElement, ErrorAlertProps>(
  ({ error, className }, ref) => {
    return (
      <Alert variant="destructive" className={className} ref={ref} tabIndex={0}>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  },
);

export default ErrorAlert;
