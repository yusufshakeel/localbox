import {signIn, signOut} from 'next-auth/react';

export async function handleCredentialsSignIn({ username, password }: {
  username: string,
  password: string
}) {
  await signIn('credentials', { username, password, callbackUrl: '/', redirectTo: '/' });
}

export async function handleSignOut() {
  await signOut({ callbackUrl: '/' });
}