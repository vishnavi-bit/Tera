// Scaffold-owned glue file (STORY-105). Modules register at the markers below; do not edit the marked lines by hand.
// knm:imports
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProcurementPage } from './procurement/ProcurementPage'; // WI-032
import { DashboardPage } from './dashboard/DashboardPage'; // WI-032
import { VendorList } from './procurement/VendorList'; // WI-035
import { VendorForm } from './procurement/VendorForm'; // WI-035
import { SignInPage } from './auth/SignInPage'; // REQ-369 slice: sign-in
import { RequireSignIn } from './auth/RequireSignIn'; // REQ-369 slice: sign-in

const guarded = (element: React.ReactNode) => <RequireSignIn>{element}</RequireSignIn>;

export const router = [
  // knm:entries
  { id: 'sign-in', path: '/sign-in', element: <SignInPage /> }, // REQ-369 slice: sign-in
  { id: 'home', path: '/', element: <Navigate to="/dashboard" replace /> }, // WI-032
  { id: 'procurement', path: '/vendors/procurement', element: guarded(<ProcurementPage />) }, // WI-032
  { id: 'procurement-dashboard', path: '/dashboard', element: guarded(<DashboardPage />) }, // WI-032
  { id: 'vendors', path: '/vendors', element: guarded(<VendorList />) }, // WI-035
  { id: 'vendor-new', path: '/vendors/new', element: guarded(<VendorForm />) }, // WI-035
  { id: 'vendor-edit', path: '/vendors/:id/edit', element: guarded(<VendorForm />) }, // WI-035
  // knm:entries-end
];
