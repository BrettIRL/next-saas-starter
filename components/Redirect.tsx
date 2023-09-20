'use client';

import { redirect, usePathname } from 'next/navigation';

interface RedirectProps {
  to: string;
}

export default function Redirect({ to }: RedirectProps) {
  const pathname = usePathname();

  return redirect(to + `?from=${pathname}`);
}
