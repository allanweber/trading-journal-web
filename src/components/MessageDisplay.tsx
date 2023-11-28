import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Props = {
  message: any;
  title?: string;
  variant?: 'default' | 'destructive';
};

export function MessageDisplay(props: Props) {
  const { message, title, variant = 'default' } = props;
  if (!message) return null;

  return (
    <Alert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}

      <AlertDescription>{message['message'] ?? message}</AlertDescription>
    </Alert>
  );
}
