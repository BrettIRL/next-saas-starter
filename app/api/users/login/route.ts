import { compare } from 'bcrypt';
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/db/repositories/users';

export async function POST(req: Request) {
  const credentials: { email: string; password: string } = await req.json();

  if (!credentials.email || !credentials.password) {
    return NextResponse.json(
      { message: 'Both email and password are required' },
      { status: 400 },
    );
  }

  try {
    const user = await getUserByEmail(credentials.email);
    if (user.length === 0) {
      throw new Error('User matching email address not found.');
    }

    const validPassword = await compare(credentials.password, user[0].password);
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: 'User could not be found.' },
      { status: 404 },
    );
  }
}
