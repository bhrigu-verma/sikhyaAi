'use client';
import { SessionProvider } from 'next-auth/react';
import { PrefsProvider } from '@/lib/prefs';
import { ToastProvider } from '@/components/ui/toast';

// App-wide client providers. Theme stays in the root layout (next-themes needs
// to run before paint). Prefs/Toast/Session wrap everything else.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PrefsProvider>
        <ToastProvider>{children}</ToastProvider>
      </PrefsProvider>
    </SessionProvider>
  );
}
