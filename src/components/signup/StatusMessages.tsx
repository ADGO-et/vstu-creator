import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusMessagesProps {
  error: string | null;
  success: boolean;
  onReset: () => void;
}

export function StatusMessages({ error, success, onReset }: StatusMessagesProps) {
  if (!error && !success) return null;

  return (
    <div className="mb-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            Account created successfully! You will receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}