// Route guard: a page opens only with a signed-in session; otherwise the user is sent to the sign-in page.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../state/authStore';

export function RequireSignIn({ children }: { children: React.ReactNode }) {
  const session = useAuth((s) => s.session);
  if (!session) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}
