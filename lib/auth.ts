import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/app/db/repositories/users';

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const authResponse = await fetch(
          process.env.NEXTAUTH_URL + '/api/users/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          },
        );

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
};
