/** @jest-environment jsdom */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ChakraAppProvider } from '../../../../src/styling/ChakraAppProvider';
import { DashboardPage } from '../../../../src/app/dashboard/DashboardPage';
import { PurchaseOrder, summarizePurchaseOrders, usePurchaseOrders, useVendors, Vendor } from '../../../../src/state/procurementStore';

const po = (over: Partial<PurchaseOrder>): PurchaseOrder => ({
  id: 'x', poNumber: 'PO-2026-0001', vendorId: 'VEN-1', unitId: 'UNIT-1', status: 'draft', createdBy: 'u1',
  createdAt: '2026-11-17T10:00:00.000Z', lines: [], total: 0, totalPaise: 0, ...over
});
const vendor = (over: Partial<Vendor>): Vendor => ({
  id: 'VEN-7', name: 'Acme Castings', contact: null, phone: null, email: null, gst: null, address: null, notes: null,
  active: true, createdAt: '2026-11-17T10:00:00.000Z', updatedAt: '2026-11-17T10:00:00.000Z', ...over
});

describe('dashboard figures', () => {
  it('counts POs, draft POs, vendors and value (paise summed, shown in rupees)', () => {
    const s = summarizePurchaseOrders([
      po({ id: 'a', vendorId: 'VEN-1', totalPaise: 350700 }),
      po({ id: 'b', vendorId: 'VEN-2', totalPaise: 10, status: 'approved' })
    ]);
    expect(s).toEqual({ total: 2, open: 1, vendors: 2, value: 3507.1, byStatus: { draft: 1, approved: 1 } });
  });

  it('is all zeros for an empty list', () => {
    expect(summarizePurchaseOrders([])).toEqual({ total: 0, open: 0, vendors: 0, value: 0, byStatus: {} });
  });
});

describe('dashboard page', () => {
  it('shows the figures, the latest POs with their number and vendor name, and a way into Procurement', async () => {
    (global as any).fetch = jest.fn((url: string) => Promise.resolve({
      ok: true, status: 200,
      json: async () => (url.includes('/vendors') ? { vendors: [vendor({})] } : { purchaseOrders: [po({ id: 'a', vendorId: 'VEN-7', total: 30, totalPaise: 3000 })] })
    } as Response));
    usePurchaseOrders.setState({ orders: [] });
    useVendors.setState({ vendors: [] });
    render(<ChakraAppProvider><MemoryRouter><DashboardPage /></MemoryRouter></ChakraAppProvider>);
    expect(await screen.findByText('PO-2026-0001')).toBeInTheDocument();
    expect(screen.getAllByText('Acme Castings').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Manage vendors' })).toHaveAttribute('href', '/vendors');
    expect(screen.getByText('Purchase orders')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Procurement' })).toHaveAttribute('href', '/vendors/procurement');
  });

  it('asks for sign-in when the API answers 401', async () => {
    (global as any).fetch = jest.fn(() => Promise.resolve({ ok: false, status: 401, json: async () => ({ error: 'tenant-required' }) } as Response));
    usePurchaseOrders.setState({ orders: [] });
    render(<ChakraAppProvider><MemoryRouter><DashboardPage /></MemoryRouter></ChakraAppProvider>);
    expect((await screen.findAllByText('Sign in is needed to see purchase orders.')).length).toBeGreaterThan(0);
  });

  it('says so when the API cannot be reached', async () => {
    (global as any).fetch = jest.fn(() => Promise.reject(new Error('down')));
    usePurchaseOrders.setState({ orders: [] });
    render(<ChakraAppProvider><MemoryRouter><DashboardPage /></MemoryRouter></ChakraAppProvider>);
    expect((await screen.findAllByText(/could not be loaded/)).length).toBeGreaterThan(0);
  });
});
