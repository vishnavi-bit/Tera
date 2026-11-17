// Sign-in (REQ-369, first slice): email and password, one button. A successful sign-in stores the session and opens the dashboard.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { apiFetch } from '../../api/apiFetch';
import { saveSession, Session } from '../../state/authStore';

export const BAD_CREDENTIALS = 'The email or password is not right.';
export const LOCKED = 'Too many failed attempts. Wait 15 minutes and try again.';
export const UNAVAILABLE = 'Sign in is not available right now. Check that the API is running.';

export function messageFor(status: number): string {
  if (status === 401) return BAD_CREDENTIALS;
  if (status === 429) return LOCKED;
  return UNAVAILABLE;
}

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (email.trim() === '' || password === '') { setMessage('Enter your email and password.'); return; }
    setBusy(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      if (!res.ok) { setMessage(messageFor(res.status)); return; }
      const body = await res.json();
      saveSession({ token: body.token, user: body.user } as Session);
      setPassword('');
      navigate('/dashboard', { replace: true });
    } catch {
      setMessage(UNAVAILABLE);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box p={6} maxW="sm" mx="auto" mt={10}>
      <Heading as="h1" size="lg" mb={6}>Sign in</Heading>
      <Box as="form" onSubmit={signIn} aria-label="Sign in">
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          {message && <Text color="red.500" role="alert">{message}</Text>}
          <Button type="submit" colorScheme="blue" isLoading={busy}>Sign in</Button>
        </Stack>
      </Box>
    </Box>
  );
}
