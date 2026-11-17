# Gap list: Parcel waiting at the gate

There is **no Resident App specification**. Screens are derived from the Guard App documents (`docs/resident_app_scope.md`). Sequence: `sequences/parcel-notice.json`. Seed (demo data): `mock-app/mock-data/seeds/parcel-notice.json`.

## Spec gaps

1. **Resident notification.** Whether the resident is told when a parcel is held at the gate is not defined.
2. **Collection record.** The Guard App records collection. Whether the resident also confirms it in this app is not defined; the tour ends on a "Not defined" alert.
3. **Parcel details.** Reference, company, received time and gate come from the Guard S08 fields. Photo is not shown.
4. **Collecting for someone else, or delivery to the flat.** Not mentioned in the documents.
