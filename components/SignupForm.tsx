'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SignupFormFields {
  email: string;
  password: string;
}

const userAuthSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();
type FormData = z.infer<typeof userAuthSchema>;

export function SignupForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   setFields(fields => ({ ...fields, [id]: value }));
  // };
  //
  // const handleSubmit = async (event: React.SyntheticEvent) => {
  //   event.preventDefault();
  //   const { email, password } = fields;
  //   setIsLoading(true);
  //
  //   if (!email || !password) {
  //     setIsLoading(false);
  //     return;
  //   }
  //
  //   try {
  //     const res = await fetch('/api/users/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });
  //
  //     if (res.ok) {
  //       signIn('credentials', { email, password, callbackUrl: '/' });
  //     }
  //   } catch (error) {}
  //
  //   setIsLoading(false);
  // };  } = useForm<FormData>({
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (res.ok) {
        signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
        });
      }
    } catch (error) {}

    setIsLoading(false);
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </Button>
    </div>
  );
}
