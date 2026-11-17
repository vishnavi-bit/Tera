# Dealer: Service job card

Requirement REQ-398 · Feature FEAT-1361 · Decision DEC-433
Order: 32 of 37 · Depends on: 29 Dealer: Sale invoice with serial capture

## Purpose
Dealer serviceman opens a service job card for a customer's vehicle, inspects it and completes the service. Service history is recorded.

## Behaviour
- Job card holds the product or chassis, meter reading, job type, free or paid, requirements, photos and notes.
- Serviceman inspects, adds parts and completes the job.
- A completed job is listed under the customer's service history.

## Acceptance criteria
1. A job card can be opened with all listed fields.
2. The serviceman can inspect, add parts and complete the job.
3. A completed job appears in the customer's service history.

## Source documents
- docs/source/functional_brief.md section 2.10
- docs/source/workflows/flow_service_warranty.md
- docs/source/workflows/feature_catalog.md D40, D41, D42

## Open questions
- None.
