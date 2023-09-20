import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { insertUser } from '@/app/db/repositories/users';

export async function POST(req: Request) {
  const { email, password }: { email: string; password: string } =
    await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Both the email and password are required.' },
      { status: 400 },
    );
  }

  try {
    const hashedPassword = await hash(password, 10);
    const user = await insertUser({ email, password: hashedPassword });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error saving user to database.' },
      { status: 422 },
    );
  }
}
