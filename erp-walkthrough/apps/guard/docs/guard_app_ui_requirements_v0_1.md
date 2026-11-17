# Residential Society Management
## Guard App — UI & Functional Requirements

**Mock-up specification**  
**Location:** New Delhi society  
**Version:** 0.1  
**Status:** Draft for sponsor feedback

---

## 1. Purpose and Scope

Define the first-pass Guard App experience so clickable mock-up screens can be prepared for sponsor review. This is a proposal based on the discussion, not a final signed-off specification. Use the mock-ups to validate workflows and terminology before committing to detailed hardware integration.

**Primary guard goal:** Identify the person, verify entry permission, record entry and exit, and handle exceptions quickly and consistently.

## 2. Working Assumptions

- The first release includes a Guard App, Resident App, and Admin App sharing a backend.
- The society has two gates. Both gates use the same workflow; each guard session is associated with the assigned gate.
- The society already has RFID hardware. The software team is not supplying or installing hardware.
- RFID integration depends on confirming the reader/controller make, model, API/SDK, and supported capabilities.
- Visitors do not need to install an app. A visitor may present a QR code or digital pass received through WhatsApp or another channel.
- The Guard App supports visitor registration, resident approval requests, entry/exit logs, and gate parcel handling.
- Resident approval is available through the Resident App. A guard may also call the resident and record the explicit decision.

## 3. User Roles and Access

### Guard
Handles visitor checks and records at the assigned gate. Access should be limited to the information and actions needed for gate operations.

### Supervisor/Admin (if enabled)
May review records and handle configured exceptions. Supervisor features are not required in the first mock-up unless the sponsor asks for them.

## 4. Proposed Screens

### S01 — Login / Start Shift
- Guard signs in securely.
- Show the guard’s name, assigned gate, and shift status.
- Do not allow a guard to switch gates unless permitted by the administrator.

### S02 — Home / Gate Dashboard
- Show the active gate prominently: Gate 1 or Gate 2.
- Show guard identity and a connection/status indicator if available.
- Primary actions: **Scan Pass**, **Register Visitor**, **Pending Approvals**, and **Check Out**.
- Show compact counts for visitors currently inside and pending approvals.

### S03 — Scan Visitor Pass
- Open a camera-based QR scanner.
- Display clear outcomes: **Valid**, **Expired**, **Already Used**, **Not Found**, or **Needs Verification**.
- Provide a manual fallback to search for or register a visitor if scanning fails.

### S04 — Visitor Details / Registration
Capture, as required by society policy:
- Visitor name
- Phone number, if available
- Destination flat/resident
- Visitor category
- Purpose of visit
- Photo
- Identity details, only where required

For repeat visitors, suggest previously used resident/destination details but require the guard to confirm them.

### S05 — Permission & Approval Status
- Display visitor details, destination flat, pass/pre-approval status, resident availability status when supplied, and current decision.
- Statuses: **Pending**, **Approved**, **Rejected**, or **Expired**.
- Actions: **Send Approval Request**, **Call Resident**, and **Refresh Status**.
- If the resident gives a decision by phone, the guard records the explicit decision. A phone call alone is not approval.

### S06 — Entry Decision / Check-In
- Clearly show **ALLOW ENTRY** or **DO NOT ALLOW ENTRY**, with the reason.
- For an allowed visitor, confirm check-in and record timestamp, gate, guard, visitor category, and decision source.
- Do not check in a visitor while approval is pending or rejected.

### S07 — Visitors Inside / Check-Out
- Search or filter active visits by visitor, flat, category, or entry time.
- Provide a clear **Check Out** action that records exit time and gate.
- Flag overdue visits based on configured category limits.
- Avoid repeated, noisy alerts for the same overdue visit.

### S08 — Delivery / Parcel at Gate
- Record delivery company/person, recipient flat, parcel reference or photo if required, time received, storage/holding status, and handover/collection confirmation.
- A delivery handed over at the gate does not require an inside-visitor check-out record.

### S09 — Recent Activity / Help (Optional)
- Show recent entry/exit and parcel events for the current gate.
- Provide a help/escalation route.
- This may be a tab or section rather than a separate screen.

## 5. Visitor Categories and Proposed Behaviour

| Category / scenario | Proposed guard workflow | Important rule |
|---|---|---|
| Pre-approved personal visitor | Scan pass or find the guest record; verify validity and resident-availability rule; record entry. | No fresh confirmation only if the authorisation is valid and policy permits it. |
| Guest on list but no pass | Find guest record; verify identity/details required by policy; follow configured authorisation. | Being on a list does not automatically bypass every check; sponsor to confirm policy. |
| Unlisted personal visitor | Register details; request resident approval; wait for explicit approval. | Default: no entry while pending, rejected, or without a required response. |
| Food delivery / courier | Record delivery and recipient; follow category-specific rule; allow gate handover/parcel holding where applicable. | Do not assume every delivery person may enter the society. |
| Domestic help / repeat service visitor | Find registered person; verify schedule/permission and status; log entry/exit. | Access schedules, validity, and block/revoke rules are configurable requirements to confirm. |
| Resident / family member / resident vehicle | Use existing RFID integration if supported; show access event/status where available. | Exact app involvement depends on existing controller capabilities. Do not promise direct gate control yet. |

## 6. Core Flows for the Clickable Mock-up

- **Flow A — Pre-approved visitor:** Home → Scan Pass → Valid pass/details → Confirm entry → Entry recorded → Visitors Inside.
- **Flow B — Unlisted visitor:** Home → Register Visitor → Select resident/flat → Send approval request → Pending → Approved or Rejected → Check in only if approved.
- **Flow C — Resident does not answer:** Approval remains pending; guard may retry/call and record an explicit decision. Under the proposed default, no entry without approval.
- **Flow D — Delivery at gate:** Home → Delivery/Parcel → Enter recipient and delivery details → Record holding/handover → Mark collected if applicable.
- **Flow E — Visitor exits:** Home → Visitors Inside → Find visitor → Check Out → Exit recorded.

## 7. UI and Usability Guidance

- Design for quick use under time pressure: large tap targets, high contrast, short labels, and minimal typing.
- Use clear text plus icons; do not rely on colour alone for Allow, Pending, or Deny.
- Keep Gate 1 / Gate 2 visible on the home screen and in every access record.
- Use explicit status labels: **Pending Approval**, **Approved**, **Rejected**, **Expired**, **Checked In**, and **Checked Out**.
- Provide confirmation before finalising an entry or exit record; make errors recoverable with an audit trail.
- Show only necessary personal data. ID collection, photo capture, and retention rules must be confirmed with the society.
- Mock-ups may use sample data, but label it as demo data. Do not imply actual RFID hardware integration exists yet.

## 8. Requirements to Confirm with Sponsor

1. What are the RFID reader and controller make/model? Can the vendor provide API/SDK documentation and a test environment?
2. Does the existing system already manage card permissions and access logs? Is the new app expected to control barriers, or only integrate with records/events?
3. What exactly counts as a valid QR pass, and can a pass be reused for repeat visits?
4. For guests who are on a list but have no pass, is resident approval still required?
5. What identity information is mandatory for each category? Avoid assuming government ID/Aadhaar is always required.
6. Which delivery types may enter, and which must remain at the gate for handover?
7. What should happen when a resident does not respond, the network is down, or the controller cannot be reached?
8. What visitor time limits, overdue alerts, and escalation rules should apply by category?
9. Can guards search historical visits, and which fields may they see?
10. What is the policy for storing visitor photos, identity data, and audit logs, and for how long?

## 9. Out of Scope for This Mock-up

- Supplying or installing RFID readers, controllers, barriers, or other physical hardware.
- Guaranteeing hardware compatibility before technical documentation and testing.
- Final offline access-control policy or fail-safe design.
- Production-grade backend, push notifications, WhatsApp integration, or real QR validation.
- Final privacy, retention, and compliance policy; these require sponsor confirmation.

## 10. Mock-up Acceptance Checklist

- [ ] A guard can identify the active gate immediately.
- [ ] The primary actions are visible from the home screen.
- [ ] The pre-approved visitor flow can be demonstrated end to end.
- [ ] The unlisted visitor flow includes a pending approval state and explicit approve/reject outcomes.
- [ ] A pending or rejected visitor cannot be shown as admitted.
- [ ] The delivery-at-gate flow is distinct from visitor entry.
- [ ] The visitors-inside list supports check-out.
- [ ] Gate, guard, timestamps, and decision source appear in relevant record views.
- [ ] Open policy and integration questions are marked rather than silently assumed.

---

**Status note:** This document is a working draft for UI mock-up and sponsor discussion. Sponsor decisions and hardware discovery may change requirements.
