// Vendors > New and Vendors > Edit (WI-035): the vendor form per the mock (Name and Active on the first row, then Contact,
// Phone, Email, GST, Address and Notes, with "Save vendor"). The same form creates and edits; the rules are in procurementStore.ts.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Heading, Input, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react';
import { EMPTY_VENDOR, loadVendor, saveVendor, validateVendorForm, VendorForm as Form, VendorFormErrors, vendorToForm } from '../../state/procurementStore';

export function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY_VENDOR);
  const [errors, setErrors] = useState<VendorFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    loadVendor(id)
      .then((v) => { if (alive) setForm(vendorToForm(v)); })
      .catch((e) => { if (alive) setLoadError(e instanceof Error ? e.message : 'The vendor could not be loaded.'); });
    return () => { alive = false; };
  }, [id]);

  const set = <K extends keyof Form>(key: K) => (value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const found = validateVendorForm(form);
    setErrors(found);
    setMessage(null);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      await saveVendor(form, id);
      navigate('/vendors');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'The vendor was not saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box p={6}>
      <Text color="gray.500" fontSize="sm">Vendors &gt; {id ? 'Edit' : 'New'}</Text>
      <Heading size="md" mb={4}>{id ? 'Edit vendor' : 'New vendor'}</Heading>
      {loadError && <Text color="red.500" mb={4}>{loadError}</Text>}
      <Box as="form" onSubmit={save} aria-label="Vendor" maxW="2xl">
        <Stack spacing={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} alignItems="end">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input value={form.name} onChange={(e) => set('name')(e.target.value)} />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <Checkbox isChecked={form.active} onChange={(e) => set('active')(e.target.checked)} pb={2}>Active</Checkbox>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Contact</FormLabel>
              <Input value={form.contact} onChange={(e) => set('contact')(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input value={form.phone} onChange={(e) => set('phone')(e.target.value)} />
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.gst}>
              <FormLabel>GST</FormLabel>
              <Input value={form.gst} onChange={(e) => set('gst')(e.target.value)} />
              <FormErrorMessage>{errors.gst}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input value={form.address} onChange={(e) => set('address')(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea value={form.notes} onChange={(e) => set('notes')(e.target.value)} />
          </FormControl>
          {message && <Text color="red.500" role="alert">{message}</Text>}
          <Box>
            <Button type="submit" colorScheme="blue" isLoading={saving}>Save vendor</Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
