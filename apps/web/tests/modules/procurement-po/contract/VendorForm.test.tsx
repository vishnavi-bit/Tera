/** @jest-environment jsdom */
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraAppProvider } from '../../../../src/styling/ChakraAppProvider';
import { VendorForm } from '../../../../src/app/procurement/VendorForm';
import { activeVendors, EMPTY_VENDOR, toVendorPayload, validateVendorForm, Vendor } from '../../../../src/state/procurementStore';

const filled = { ...EMPTY_VENDOR, name: '  Acme Castings ', contact: 'R. Iyer', email: 'sales@acme.example', gst: '29ABCDE1234F1Z5' };
const saved: Vendor = { id: 'v1', name: 'Acme Castings', contact: 'R. Iyer', phone: null, email: 'sales@acme.example', gst: '29ABCDE1234F1Z5', address: null, notes: null, active: true, createdAt: '2026-11-17T10:00:00.000Z', updatedAt: '2026-11-17T10:00:00.000Z' };

function json(body: unknown, status = 200) {
  return Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);
}

function renderForm(path = '/vendors/new') {
  return render(
    <ChakraAppProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/vendors/new" element={<VendorForm />} />
          <Route path="/vendors/:id/edit" element={<VendorForm />} />
          <Route path="/vendors" element={<p>Vendor list</p>} />
        </Routes>
      </MemoryRouter>
    </ChakraAppProvider>
  );
}

describe('vendor form rules', () => {
  it('accepts a vendor with only a name, and with a GST that is not known yet', () => {
    expect(validateVendorForm({ ...EMPTY_VENDOR, name: 'Walk-in' })).toEqual({});
    expect(validateVendorForm(filled)).toEqual({});
  });

  it('asks for the name and refuses a malformed email or an overlong GST', () => {
    expect(validateVendorForm({ ...EMPTY_VENDOR, name: '   ' }).name).toBeDefined();
    expect(validateVendorForm({ ...filled, email: 'not-an-email' }).email).toBeDefined();
    expect(validateVendorForm({ ...filled, gst: '1'.repeat(16) }).gst).toBeDefined();
  });

  it('sends trimmed text and the active flag', () => {
    expect(toVendorPayload({ ...filled, active: false })).toEqual({
      name: 'Acme Castings', active: false, contact: 'R. Iyer', phone: '', email: 'sales@acme.example', gst: '29ABCDE1234F1Z5', address: '', notes: ''
    });
  });

  it('leaves inactive vendors out of the vendors a PO may use', () => {
    const off = { ...saved, id: 'v2', active: false };
    expect(activeVendors([saved, off]).map((v) => v.id)).toEqual(['v1']);
  });
});

describe('vendor form screen', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? json(saved, 201) : json({}));
  });

  it('shows the mock fields in order with Save vendor', () => {
    renderForm();
    const labels = ['Name', 'Active', 'Contact', 'Phone', 'Email', 'GST', 'Address', 'Notes'];
    const found = screen.getAllByText(/^(Name|Active|Contact|Phone|Email|GST|Address|Notes)$/).map((el) => el.textContent);
    expect(found).toEqual(labels);
    expect(screen.getByRole('button', { name: 'Save vendor' })).toBeInTheDocument();
    expect(screen.getByLabelText('Active')).toBeChecked();
  });

  it('shows the name error and sends nothing when the name is blank', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Save vendor' }));
    expect(await screen.findByText('Enter the vendor name')).toBeInTheDocument();
    expect((global as any).fetch.mock.calls.some((c: any[]) => c[1]?.method === 'POST')).toBe(false);
  });

  it('creates the vendor with the typed fields and goes back to the list', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Acme Castings' } });
    fireEvent.change(screen.getByLabelText('Contact'), { target: { value: 'R. Iyer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save vendor' }));
    expect(await screen.findByText('Vendor list')).toBeInTheDocument();
    const post = (global as any).fetch.mock.calls.find((c: any[]) => c[1]?.method === 'POST');
    expect(post[0]).toBe('/api/procurement/vendors');
    expect(JSON.parse(post[1].body)).toMatchObject({ name: 'Acme Castings', contact: 'R. Iyer', active: true });
  });

  it('shows the server message when the save is refused', async () => {
    (global as any).fetch = jest.fn((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? json({ error: 'email is not a valid address' }, 400) : json({}));
    renderForm();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save vendor' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('email is not a valid address');
  });

  it('loads an existing vendor into the form when editing and saves with PATCH', async () => {
    (global as any).fetch = jest.fn((_url: string, init?: RequestInit) => {
      if (init?.method === 'PATCH') return json({ ...saved, name: 'Acme Renamed' });
      return json(saved);
    });
    renderForm('/vendors/v1/edit');
    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue('Acme Castings'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Acme Renamed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save vendor' }));
    expect(await screen.findByText('Vendor list')).toBeInTheDocument();
    const patch = (global as any).fetch.mock.calls.find((c: any[]) => c[1]?.method === 'PATCH');
    expect(patch[0]).toBe('/api/procurement/vendors/v1');
  });
});
