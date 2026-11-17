// Dashboard (REQ-370, merged with REQ-376): the vendor master and the vendor purchase orders at a glance, with links into
// the vendor screens and the procurement screen.
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Link, SimpleGrid, Stat, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Stack } from '@chakra-ui/react';
import { activeVendors, LOAD_FAILED, loadPurchaseOrders, loadVendors, summarizePurchaseOrders, usePurchaseOrders, useVendors, VENDOR_LOAD_FAILED } from '../../state/procurementStore';
import { useAuth, clearSession } from '../../state/authStore';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const orders = usePurchaseOrders((s) => s.orders);
  const vendors = useVendors((s) => s.vendors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorError, setVendorError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadPurchaseOrders()
      .then(() => { if (alive) setError(null); })
      .catch((e) => { if (alive) setError(e instanceof Error && e.message.startsWith('Sign in') ? e.message : LOAD_FAILED); })
      .finally(() => { if (alive) setLoading(false); });
    loadVendors()
      .then(() => { if (alive) setVendorError(null); })
      .catch((e) => { if (alive) setVendorError(e instanceof Error && e.message.startsWith('Sign in') ? e.message : VENDOR_LOAD_FAILED); });
    return () => { alive = false; };
  }, []);

  const navigate = useNavigate();
  const userName = useAuth((s) => s.session?.user.name ?? '');
  const signOut = () => { clearSession(); navigate('/sign-in', { replace: true }); };

  const summary = summarizePurchaseOrders(orders);
  const vendorName = (id: string) => vendors.find((v) => v.id === id)?.name ?? id;
  const recentPos = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const recentVendors = [...vendors].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);

  return (
    <Box p={6}>
      <Text color="gray.500" fontSize="sm">Vendors</Text>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} mb={6}>
        <Heading as="h1" size="lg">Procurement dashboard</Heading>
        <Stack direction="row" spacing={3}>
          <Button as={RouterLink} to="/vendors" colorScheme="blue" variant="outline">Manage vendors</Button>
          <Button as={RouterLink} to="/vendors/procurement" colorScheme="blue" variant="outline">Open Procurement</Button>
          <Button variant="ghost" onClick={signOut}>Sign out{userName ? ` (${userName})` : ''}</Button>
        </Stack>
      </Stack>

      {error && <Text role="alert" mb={4}>{error}</Text>}
      {vendorError && <Text role="alert" mb={4}>{vendorError}</Text>}
      {loading && <Text mb={4}>Loading...</Text>}

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Vendors</StatLabel><StatNumber>{vendors.length}</StatNumber></Stat>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Active vendors</StatLabel><StatNumber>{activeVendors(vendors).length}</StatNumber></Stat>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Vendors with POs</StatLabel><StatNumber>{summary.vendors}</StatNumber></Stat>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Purchase orders</StatLabel><StatNumber>{summary.total}</StatNumber></Stat>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Open (draft)</StatLabel><StatNumber>{summary.open}</StatNumber></Stat>
        <Stat borderWidth="1px" borderRadius="md" p={4}><StatLabel>Order value</StatLabel><StatNumber>{summary.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatNumber></Stat>
      </SimpleGrid>

      <Heading as="h2" size="md" mb={3}>Recent vendors</Heading>
      {recentVendors.length === 0 && !loading && !vendorError && <Text mb={8}>No vendors yet. <Link as={RouterLink} to="/vendors/new" color="blue.500">Add a vendor</Link>.</Text>}
      {recentVendors.length > 0 && (
        <TableContainer mb={8}>
          <Table size="sm">
            <Thead><Tr><Th>Name</Th><Th>Contact</Th><Th>Phone</Th><Th>GST</Th><Th>Status</Th></Tr></Thead>
            <Tbody>
              {recentVendors.map((v) => (
                <Tr key={v.id}><Td>{v.name}</Td><Td>{v.contact ?? ''}</Td><Td>{v.phone ?? ''}</Td><Td>{v.gst ?? ''}</Td><Td>{v.active ? 'Active' : 'Inactive'}</Td></Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Heading as="h2" size="md" mb={3}>Recent purchase orders</Heading>
      {recentPos.length === 0 && !loading && !error && <Text>No purchase orders yet. Create one from Procurement.</Text>}
      {recentPos.length > 0 && (
        <TableContainer>
          <Table size="sm">
            <Thead><Tr><Th>PO number</Th><Th>Vendor</Th><Th isNumeric>Total</Th><Th>Status</Th></Tr></Thead>
            <Tbody>
              {recentPos.map((po) => (
                <Tr key={po.id}><Td>{po.poNumber}</Td><Td>{vendorName(po.vendorId)}</Td><Td isNumeric>{po.total.toFixed(2)}</Td><Td>{po.status}</Td></Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
