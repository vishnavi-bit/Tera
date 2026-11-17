// Vendors (WI-035): the vendor list with edit and deactivate. Inactive vendors stay listed (marked Inactive) but cannot be
// chosen on a new vendor PO; the API enforces that rule.
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { deactivateVendor, loadVendors, useVendors, VENDOR_LOAD_FAILED, Vendor } from '../../state/procurementStore';

export function VendorList() {
  const vendors = useVendors((s) => s.vendors);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadVendors()
      .then(() => { if (alive) setLoadError(null); })
      .catch((e) => { if (alive) setLoadError(e instanceof Error && e.message.startsWith('Sign in') ? e.message : VENDOR_LOAD_FAILED); });
    return () => { alive = false; };
  }, []);

  async function deactivate(v: Vendor) {
    setMessage(null);
    try {
      const updated = await deactivateVendor(v.id);
      useVendors.setState({ vendors: useVendors.getState().vendors.map((x) => (x.id === updated.id ? updated : x)) });
      setMessage(`${updated.name} is deactivated.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'The vendor was not deactivated.');
    }
  }

  return (
    <Box p={6}>
      <Text color="gray.500" fontSize="sm">Vendors</Text>
      <Heading size="md" mb={4}>Vendors</Heading>
      <Button as={RouterLink} to="/vendors/new" colorScheme="blue" mb={6}>New vendor</Button>
      {loadError && <Text color="red.500" mb={4}>{loadError}</Text>}
      {message && <Text mb={4} role="status">{message}</Text>}
      {vendors.length === 0 && !loadError ? (
        <Text color="gray.500">No vendors yet.</Text>
      ) : (
        <TableContainer>
          <Table size="sm" aria-label="Vendors">
            <Thead>
              <Tr><Th>Name</Th><Th>Contact</Th><Th>Phone</Th><Th>Email</Th><Th>GST</Th><Th>Status</Th><Th /></Tr>
            </Thead>
            <Tbody>
              {vendors.map((v) => (
                <Tr key={v.id}>
                  <Td>{v.name}</Td><Td>{v.contact ?? ''}</Td><Td>{v.phone ?? ''}</Td><Td>{v.email ?? ''}</Td><Td>{v.gst ?? ''}</Td>
                  <Td>{v.active ? 'Active' : 'Inactive'}</Td>
                  <Td>
                    <Link as={RouterLink} to={`/vendors/${v.id}/edit`} mr={4}>Edit</Link>
                    <Button size="xs" variant="outline" onClick={() => deactivate(v)} isDisabled={!v.active}>Deactivate</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
