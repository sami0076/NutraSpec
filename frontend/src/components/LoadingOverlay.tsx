import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Full-screen loading overlay with spinner and message.
 */
export function LoadingOverlay({ message = 'Analyzing ingredients...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-base font-medium text-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        This may take a few seconds
      </p>
    </div>
  );
}
