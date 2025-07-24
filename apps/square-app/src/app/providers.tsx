'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { STALE_TIME, GC_TIME } from '@/shared/constants'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME, // 5 minutes
        gcTime: GC_TIME, // 24 hours
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider 
        refetchOnWindowFocus={false}
        refetchInterval={0}
      >
            {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
