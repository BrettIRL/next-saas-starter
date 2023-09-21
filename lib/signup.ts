interface SignUpProps {
  email: string;
  password: string;
}

export function signUp({ email, password }: SignUpProps): Promise<Response> {
  return fetch('/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
}
