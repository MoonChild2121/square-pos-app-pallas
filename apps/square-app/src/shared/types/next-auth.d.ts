// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
    };
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
