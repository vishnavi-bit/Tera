/** @jest-environment jsdom */
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraAppProvider } from '../../../../src/styling/ChakraAppProvider';
import { SignInPage, BAD_CREDENTIALS, LOCKED } from '../../../../src/app/auth/SignInPage';
import { RequireSignIn } from '../../../../src/app/auth/RequireSignIn';
import { SESSION_KEY, useAuth, clearSession } from '../../../../src/state/authStore';

const user = { id: 'u1', name: 'Development OEM admin', email: 'admin@tera.local', roles: ['super-admin', 'procurement-manager'] };

function json(body: unknown, status = 200) {
  return Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);
}

function renderApp(path = '/sign-in') {
  return render(
    <ChakraAppProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/dashboard" element={<RequireSignIn><p>Dashboard is open</p></RequireSignIn>} />
        </Routes>
      </MemoryRouter>
    </ChakraAppProvider>
  );
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('sign-in page', () => {
  beforeEach(() => {
    clearSession();
    sessionStorage.clear();
  });

  it('a correct sign-in stores the session for this tab and opens the dashboard', async () => {
    (global as any).fetch = jest.fn(() => json({ token: 'header.payload.sig', tokenType: 'Bearer', user }));
    renderApp();
    fill('Email', 'admin@tera.local');
    fill('Password', 'correct-horse-battery');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Dashboard is open')).toBeInTheDocument();
    const posted = (global as any).fetch.mock.calls[0];
    expect(posted[0]).toBe('/api/auth/login');
    expect(JSON.parse(posted[1].body)).toEqual({ email: 'admin@tera.local', password: 'correct-horse-battery' });
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY)!)).toMatchObject({ token: 'header.payload.sig', user: { email: 'admin@tera.local' } });
    expect(useAuth.getState().session?.token).toBe('header.payload.sig');
  });

  it('a wrong password shows the message and signs nobody in', async () => {
    (global as any).fetch = jest.fn(() => json({ error: 'invalid-credentials' }, 401));
    renderApp();
    fill('Email', 'admin@tera.local');
    fill('Password', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(BAD_CREDENTIALS);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    expect(useAuth.getState().session).toBeNull();
  });

  it('after too many failures it says to wait', async () => {
    (global as any).fetch = jest.fn(() => json({ error: 'too-many-attempts' }, 429));
    renderApp();
    fill('Email', 'admin@tera.local');
    fill('Password', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(LOCKED);
  });

  it('empty fields are refused without calling the API', async () => {
    (global as any).fetch = jest.fn();
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter your email and password.');
    expect((global as any).fetch).not.toHaveBeenCalled();
  });
});

describe('route guard', () => {
  beforeEach(() => {
    clearSession();
    sessionStorage.clear();
  });

  it('sends a signed-out user from a protected page to the sign-in page', async () => {
    renderApp('/dashboard');
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard is open')).not.toBeInTheDocument();
  });

  it('opens a protected page for a signed-in user', async () => {
    useAuth.setState({ session: { token: 't', user } });
    renderApp('/dashboard');
    await waitFor(() => expect(screen.getByText('Dashboard is open')).toBeInTheDocument());
  });
});
