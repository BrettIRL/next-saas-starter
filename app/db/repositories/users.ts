import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '@/app/db/schema/users';
import type { User, NewUser } from '@/app/db/schema/users';

const db = drizzle(sql);

export async function getUserByEmail(email: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.email, email));
}

export async function insertUser(user: NewUser): Promise<User[]> {
  return db.insert(users).values(user).returning();
}
