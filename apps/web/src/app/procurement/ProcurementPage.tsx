// Vendors > Procurement (REQ-370, merged with REQ-376): raise a vendor purchase order for a vendor (active vendors only), a
// receiving unit, a part, quantity and rate, and see the POs with their number, total and status. The shortage view (needed
// against stock in hand) waits on Bill of materials (REQ-375); until then the order is entered by hand.
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, NumberInput, NumberInputField, Select, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { apiFetch } from '../../api/apiFetch';
import {
  activeVendors, LOAD_FAILED, loadPurchaseOrders, loadVendors, PoForm, PoFormErrors, PurchaseOrder, toPoPayload,
  usePurchaseOrders, useVendors, validatePoForm, PO_ENDPOINT as ENDPOINT
} from '../../state/procurementStore';

const EMPTY: PoForm = { vendorId: '', unitId: '', partId: '', quantity: '', rate: '' };

export function ProcurementPage() {
  const orders = usePurchaseOrders((s) => s.orders);
  const vendors = useVendors((s) => s.vendors);
  const setOrders = usePurchaseOrders.setState;
  const [form, setForm] = useState<PoForm>(EMPTY);
  const [errors, setErrors] = useState<PoFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    loadPurchaseOrders()
      .then(() => { if (alive) setLoadError(null); })
      .catch((e) => { if (alive) setLoadError(e instanceof Error && e.message.startsWith('Sign in') ? e.message : LOAD_FAILED); });
    loadVendors().catch(() => undefined);                 // the picker is empty if this fails; the form says so
    return () => { alive = false; };
  }, []);

  const choosable = useMemo(() => activeVendors(vendors), [vendors]);
  const vendorName = (id: string) => vendors.find((v) => v.id === id)?.name ?? id;
  const set = (key: keyof PoForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function createPo(e: React.FormEvent) {
    e.preventDefault();
    const found = validatePoForm(form);
    setErrors(found);
    setMessage(null);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      const res = await apiFetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(toPoPayload(form)) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setMessage(typeof body.error === 'string' ? body.error : 'The purchase order was not created.'); return; }
      const po = body as PurchaseOrder;
      setOrders({ orders: [po, ...usePurchaseOrders.getState().orders] });
      setForm(EMPTY);
      setMessage(`Purchase order ${po.poNumber} created. Total ${po.total.toFixed(2)}.`);
    } catch {
      setMessage('The purchase order was not created. Check the connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box p={6}>
      <Text color="gray.500" fontSize="sm">Vendors &gt; Procurement</Text>
      <Heading as="h1" size="lg" mb={4}>Procurement</Heading>

      <Box mb={6} p={4} borderWidth="1px" borderRadius="md" maxW="xl">
        <Text fontWeight="semibold">Shortage</Text>
        <Text color="gray.600" fontSize="sm">The needed-against-stock view waits on Bill of materials. Until then, enter the order below.</Text>
      </Box>

      <Box as="form" onSubmit={createPo} aria-label="Vendor purchase order" mb={8} maxW="xl">
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.vendorId}>
            <FormLabel>Vendor</FormLabel>
            <Select placeholder={choosable.length ? 'Choose a vendor' : 'No active vendors yet'} value={form.vendorId} onChange={(e) => set('vendorId')(e.target.value)}>
              {choosable.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </Select>
            <FormErrorMessage>{errors.vendorId}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.unitId}>
            <FormLabel>Receiving unit ID</FormLabel>
            <Input value={form.unitId} onChange={(e) => set('unitId')(e.target.value)} />
            <FormErrorMessage>{errors.unitId}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.partId}>
            <FormLabel>Part ID</FormLabel>
            <Input value={form.partId} onChange={(e) => set('partId')(e.target.value)} />
            <FormErrorMessage>{errors.partId}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.quantity}>
            <FormLabel>Order qty</FormLabel>
            <NumberInput value={form.quantity} onChange={set('quantity')} min={1} precision={0}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>{errors.quantity}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.rate}>
            <FormLabel>Rate</FormLabel>
            <NumberInput value={form.rate} onChange={set('rate')} min={0} precision={2}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>{errors.rate}</FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit" colorScheme="blue" isLoading={saving}>Create PO</Button>
          </Box>
          {message && <Text role="status">{message}</Text>}
        </Stack>
      </Box>

      <Heading as="h2" size="md" mb={3}>Purchase orders</Heading>
      {loadError && <Text role="alert">{loadError}</Text>}
      {!loadError && orders.length === 0 && <Text>No purchase orders yet.</Text>}
      {orders.length > 0 && (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr><Th>PO number</Th><Th>Vendor</Th><Th>Unit</Th><Th>Lines</Th><Th isNumeric>Total</Th><Th>Status</Th></Tr>
            </Thead>
            <Tbody>
              {orders.map((po) => (
                <Tr key={po.id}>
                  <Td>{po.poNumber}</Td>
                  <Td>{vendorName(po.vendorId)}</Td>
                  <Td>{po.unitId}</Td>
                  <Td>{po.lines.map((l) => `${l.partId} x ${l.quantity} @ ${l.rate.toFixed(2)}`).join('; ')}</Td>
                  <Td isNumeric>{po.total.toFixed(2)}</Td>
                  <Td>{po.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
