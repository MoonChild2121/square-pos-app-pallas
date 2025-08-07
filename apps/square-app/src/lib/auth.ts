// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth';

const SQUARE_SANDBOX_URL = 'https://connect.squareupsandbox.com';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: 'square',
      name: 'Square',
      type: 'oauth',

      authorization: {
        url: `${SQUARE_SANDBOX_URL}/oauth2/authorize`,
        params: {
          scope: 'MERCHANT_PROFILE_READ PAYMENTS_READ PAYMENTS_WRITE ITEMS_READ ORDERS_READ',
          session: 'false',
        },
      },

      token: {
        url: `${SQUARE_SANDBOX_URL}/oauth2/token`,
        async request({ params }) {
          const response = await fetch(`${SQUARE_SANDBOX_URL}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Square-Version': '2024-01-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
              client_secret: process.env.SQUARE_APPLICATION_SECRET,
              code: params.code,
              grant_type: 'authorization_code',
              redirect_uri: 'http://localhost:3000/api/auth/callback/square',
            }),
          });

          const tokens = await response.json();

          if (!response.ok) {
            console.error('Token Error:', tokens);
            throw new Error(tokens.message || 'Failed to get access token');
          }

          return { tokens };
        },
      },

      userinfo: {
        url: `${SQUARE_SANDBOX_URL}/v2/merchants/me`,
        async request({ tokens }) {
          const response = await fetch(`${SQUARE_SANDBOX_URL}/v2/merchants/me`, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'Content-Type': 'application/json',
              'Square-Version': '2024-01-01',
            },
          });
          return response.json();
        },
      },

      clientId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
      clientSecret: process.env.SQUARE_APPLICATION_SECRET,

      profile(profile) {
        return {
          id: profile.merchant?.id || 'default-id',
          name: profile.merchant?.business_name || null,
          email: null,
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
};
