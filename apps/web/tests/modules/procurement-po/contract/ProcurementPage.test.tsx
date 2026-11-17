/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraAppProvider } from '../../../../src/styling/ChakraAppProvider';
import { ProcurementPage } from '../../../../src/app/procurement/ProcurementPage';
import { activeVendors, PurchaseOrder, toPoPayload, usePurchaseOrders, useVendors, validatePoForm, Vendor } from '../../../../src/state/procurementStore';

const filled = { vendorId: ' VEN-1 ', unitId: ' UNIT-1 ', partId: 'PART-9', quantity: '14', rate: '250.5' };
const po: PurchaseOrder = {
  id: 'p1', poNumber: 'PO-2026-0001', vendorId: 'VEN-1', unitId: 'UNIT-1', status: 'draft', createdBy: 'u1',
  createdAt: '2026-11-17T10:00:00.000Z', lines: [{ partId: 'PART-9', quantity: 14, rate: 250.5, amount: 3507 }], total: 3507, totalPaise: 350700
};
const acme: Vendor = { id: 'VEN-1', name: 'Acme Castings', contact: null, phone: null, email: null, gst: null, address: null, notes: null, active: true, createdAt: '', updatedAt: '' };
const gone: Vendor = { ...acme, id: 'VEN-2', name: 'Gone Ltd', active: false };

function json(body: unknown, status = 200) {
  return Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);
}

function renderPage() {
  return render(<ChakraAppProvider><ProcurementPage /></ChakraAppProvider>);
}

// Mocks the three calls the page makes: the vendor list, the PO list, and the PO create.
function mockApi(create: () => Promise<Response> = () => json(po, 201)) {
  (global as any).fetch = jest.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'POST') return create();
    if (url.includes('/vendors')) return json({ vendors: [acme, gone] });
    return json({ purchaseOrders: [] });
  });
}

describe('procurement form rules', () => {
  it('accepts a complete form and trims the ids; the payload carries one line', () => {
    expect(validatePoForm(filled)).toEqual({});
    expect(toPoPayload(filled)).toEqual({ vendorId: 'VEN-1', unitId: 'UNIT-1', lines: [{ partId: 'PART-9', quantity: 14, rate: 250.5 }] });
  });

  it('refuses no vendor, no unit, empty part, a fractional or zero quantity, a negative, empty or 3-decimal rate', () => {
    expect(validatePoForm({ ...filled, vendorId: '' }).vendorId).toBeDefined();
    expect(validatePoForm({ ...filled, unitId: '  ' }).unitId).toBeDefined();
    expect(validatePoForm({ ...filled, partId: '' }).partId).toBeDefined();
    expect(validatePoForm({ ...filled, quantity: '1.5' }).quantity).toBeDefined();
    expect(validatePoForm({ ...filled, quantity: '0' }).quantity).toBeDefined();
    expect(validatePoForm({ ...filled, rate: '-2' }).rate).toBeDefined();
    expect(validatePoForm({ ...filled, rate: '' }).rate).toBeDefined();
    expect(validatePoForm({ ...filled, rate: '1.005' }).rate).toBeDefined();
  });

  it('offers only active vendors', () => {
    expect(activeVendors([acme, gone]).map((v) => v.id)).toEqual(['VEN-1']);
  });
});

describe('procurement page', () => {
  beforeEach(() => {
    usePurchaseOrders.setState({ orders: [] });
    useVendors.setState({ vendors: [] });
    mockApi();
  });

  it('offers only active vendors, then shows the PO number and total after create', async () => {
    renderPage();
    expect(await screen.findByText('No purchase orders yet.')).toBeInTheDocument();

    const vendorSelect = screen.getByLabelText('Vendor') as HTMLSelectElement;
    expect(await screen.findByRole('option', { name: 'Acme Castings' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Gone Ltd' })).not.toBeInTheDocument();

    fireEvent.change(vendorSelect, { target: { value: 'VEN-1' } });
    fireEvent.change(screen.getByLabelText('Receiving unit ID'), { target: { value: 'UNIT-1' } });
    fireEvent.change(screen.getByLabelText('Part ID'), { target: { value: 'PART-9' } });
    fireEvent.change(screen.getByLabelText('Order qty'), { target: { value: '14' } });
    fireEvent.change(screen.getByLabelText('Rate'), { target: { value: '250.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create PO' }));

    expect(await screen.findByText('Purchase order PO-2026-0001 created. Total 3507.00.')).toBeInTheDocument();
    const rows = await screen.findAllByRole('row');
    expect(rows.some((r) => r.textContent?.includes('PO-2026-0001') && r.textContent.includes('Acme Castings') && r.textContent.includes('draft'))).toBe(true);
    const post = (global as any).fetch.mock.calls.find((c: any[]) => c[1]?.method === 'POST');
    expect(post[0]).toBe('/api/procurement/vendor-purchase-orders');
    expect(JSON.parse(post[1].body)).toEqual({ vendorId: 'VEN-1', unitId: 'UNIT-1', lines: [{ partId: 'PART-9', quantity: 14, rate: 250.5 }] });
  });

  it('does not send the form when a field is invalid', async () => {
    renderPage();
    await screen.findByText('No purchase orders yet.');
    fireEvent.change(screen.getByLabelText('Receiving unit ID'), { target: { value: 'UNIT-1' } });
    fireEvent.change(screen.getByLabelText('Part ID'), { target: { value: 'PART-9' } });
    fireEvent.change(screen.getByLabelText('Order qty'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Rate'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create PO' }));
    expect(await screen.findByText('Choose the vendor')).toBeInTheDocument();
    expect(screen.getByText('Quantity must be a whole number above 0')).toBeInTheDocument();
    expect((global as any).fetch.mock.calls.some((c: any[]) => c[1]?.method === 'POST')).toBe(false);
  });

  it('shows the server message when the create is refused', async () => {
    mockApi(() => json({ error: 'vendor is inactive: choose an active vendor' }, 422));
    renderPage();
    await screen.findByRole('option', { name: 'Acme Castings' });
    fireEvent.change(screen.getByLabelText('Vendor'), { target: { value: 'VEN-1' } });
    fireEvent.change(screen.getByLabelText('Receiving unit ID'), { target: { value: 'UNIT-1' } });
    fireEvent.change(screen.getByLabelText('Part ID'), { target: { value: 'PART-9' } });
    fireEvent.change(screen.getByLabelText('Order qty'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Rate'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create PO' }));
    expect(await screen.findByText('vendor is inactive: choose an active vendor')).toBeInTheDocument();
    await waitFor(() => expect(usePurchaseOrders.getState().orders).toEqual([]));
  });

  it('shows the shortage view as waiting on Bill of materials', async () => {
    renderPage();
    expect(await screen.findByText(/waits on Bill of materials/)).toBeInTheDocument();
  });
});
