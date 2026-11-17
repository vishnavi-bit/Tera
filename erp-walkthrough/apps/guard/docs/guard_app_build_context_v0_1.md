# Guard App — Application Build Context

**Project:** Residential Society Management App  
**Target society:** New Delhi, India  
**Document type:** Product and engineering context for starting implementation  
**Version:** 0.1 — working draft for sponsor validation

## 1. Purpose

Build the **Guard App**, the gate-operations component of a residential society management system. The first release is expected to include three connected applications:

1. **Guard App** for gate security staff
2. **Resident App** for residents and family members
3. **Admin App** for society administrators

This document focuses on the Guard App and gives engineers enough product context to begin UI design, application structure, and a prototype. It is not a final architecture or signed-off specification. Sponsor decisions and hardware discovery may change requirements.

## 2. Product Goal

Help a guard quickly and consistently answer four questions:

1. Who is arriving?
2. Which flat or resident are they visiting?
3. Are they authorised to enter under the society's rules?
4. Has their entry and exit been recorded?

The app should reduce manual confusion at the gate while keeping security decisions explicit and auditable.

## 3. Known Context and Assumptions

- The society has **two gates**.
- Both gates use the same guard workflow.
- The society is expected to have some RFID card-reader hardware already.
- The software team is **not** expected to supply or install physical hardware.
- The exact RFID reader/controller brand, model, protocol, and integration interface are not yet confirmed.
- Do not assume that the Guard App directly opens or closes a gate. This depends on the installed access-control system and the sponsor's desired scope.
- Visitors do not need to install an app. They may present a QR code or digital pass delivered through WhatsApp or another channel.
- Residents use the Resident App to approve or reject unexpected visitors.
- A guard may call a resident and record the resident's explicit decision.
- A visitor who requires approval must not be admitted while approval is pending, after rejection, or when the resident does not respond.
- Pre-approved visitors may follow a different path if their authorisation is valid and the resident has not disabled or revoked it.
- Visitor categories and handling rules should be configurable where practical.
- Identity verification, photos, and identity-data retention must follow a sponsor-approved policy. Do not assume that government ID or Aadhaar is mandatory for every visitor.
- Delivery-at-gate and parcel collection are in scope for the proposed first release.

## 4. User Roles

### Guard
- Signs in and operates at an assigned gate.
- Scans passes and searches for visitor records.
- Registers unlisted visitors.
- Requests resident approval.
- Records explicit decisions received by phone.
- Checks visitors in and out.
- Records deliveries and parcels held at the gate.
- Views active visitors and recent activity relevant to the assigned gate.

### Resident
The Resident App is a separate application, but its behaviour affects the Guard App:
- Receives visitor-arrival and approval-request notifications.
- Sees visitor name, category, destination/context, pre-approval status, and other available details.
- Approves or rejects through a notification action where supported or inside the app.
- Can pre-authorise selected visitors or categories according to society policy.
- Can mark themselves unavailable or revoke/block a trusted visitor, subject to the final rules.

### Admin
The Admin App is a separate application, but its configuration affects guard workflows:
- Manages flats, residents, guards, gates, visitor categories, and permissions.
- Defines default visit-duration limits and authorised extension rules.
- Configures category-specific visitor and delivery policies.
- Reviews activity and audit records according to permissions.
- Manages the society's approved policy for identity data and retention.

## 5. Main Guard App Screens

Use these as the initial navigation map. Combine screens where a prototype can remain clear and usable.

1. **Login / Start Shift**
   - Authenticate the guard.
   - Show guard identity, assigned gate, and shift status.

2. **Home / Gate Dashboard**
   - Clearly display Gate 1 or Gate 2.
   - Primary actions: Scan Pass, Register Visitor, Pending Approvals, Visitors Inside / Check Out, Delivery / Parcel.
   - Show counts for pending approvals and visitors currently inside.

3. **Scan Visitor Pass**
   - Open the camera-based QR scanner.
   - Show Valid, Expired, Already Used, Not Found, or Needs Verification states.
   - Provide a manual search/register fallback if scanning fails.

4. **Visitor Search / Registration**
   - Search existing guests, domestic help, staff, and other registered people.
   - Register a new visitor when no matching record exists.
   - Capture the fields required by the approved policy: name, phone if available, destination flat/resident, category, purpose, photo, and identity-verification status/details where required.
   - Suggest prior resident/destination details for repeat visits, but require confirmation.

5. **Visitor Details / Approval Status**
   - Show destination, visitor category, pass/pre-approval status, resident availability status if provided, and current decision.
   - Actions: Send Approval Request, Call Resident, Refresh Status.
   - Statuses: Pending, Approved, Rejected, Expired.
   - A phone call alone is not approval; the guard must record the explicit decision.

6. **Entry Decision / Check-In**
   - Show a clear ALLOW ENTRY or DO NOT ALLOW ENTRY result and the reason.
   - Check in only when the applicable authorisation and verification rules are satisfied.
   - Record timestamp, gate, guard, category, and decision source.

7. **Visitors Inside / Check-Out**
   - List active visits.
   - Search/filter by visitor, flat, category, or time.
   - Check out visitors and record exit timestamp and gate.
   - Flag overdue visits based on configured category limits without repeatedly interrupting the guard.

8. **Delivery / Parcel at Gate**
   - Record delivery company/person, recipient flat, parcel reference or photo if required, arrival time, holding status, and collection/handover.
   - Distinguish gate handover from a delivery person entering the premises.

9. **Recent Activity / Help** (optional)
   - Show recent entry, exit, approval, and parcel events for the assigned gate.
   - Provide an escalation/help route.

## 6. Core Workflows

### Flow A — Valid Pre-Approved Visitor
1. Guard scans the visitor's QR/digital pass or finds the guest record.
2. App validates the pass/authorisation using the available backend integration.
3. App checks validity, intended society/gate if applicable, and whether the authorisation is revoked or expired.
4. App applies the resident-availability and category policy.
5. If all required checks pass, the guard confirms entry.
6. The app records the check-in and shows the visitor in the active-visitors list.

**Important:** Do not treat a QR image as proof by itself. The pass must be validated against an authorised record or supported verification mechanism.

### Flow B — Guest Is on a List but Has No Pass
1. Guard searches the visitor or guest list.
2. Guard confirms the identity/details required by the society's policy.
3. The app displays the existing authorisation and any required additional checks.
4. Entry is recorded only when the applicable policy is satisfied.

**Sponsor decision required:** Being on a guest list may or may not remove the need for resident confirmation.

### Flow C — Unlisted Visitor
1. Guard registers the visitor and selects the destination flat/resident and category.
2. Guard sends an approval request.
3. Resident receives a notification and opens the Resident App or uses a supported notification action.
4. Resident approves or rejects.
5. Guard sees the decision/status.
6. Entry is allowed only after explicit approval and required verification.
7. If the resident does not respond, default behaviour is **no entry** when approval is required.

### Flow D — Resident Gives a Decision by Phone
1. Guard calls the resident.
2. Resident explicitly says approve or reject.
3. Guard records the decision in the app, including decision source and timestamp.
4. The app records the guard who entered the decision.
5. Entry is allowed only if the recorded decision and other required checks permit it.

### Flow E — Delivery or Courier at the Gate
1. Guard selects Delivery / Parcel.
2. Guard records the recipient flat and delivery details.
3. The app applies the category-specific rule: approved entry, resident approval, or gate handover.
4. If the parcel remains at the gate, record where it is held and its status.
5. Record the resident's collection or handover when applicable.

### Flow F — Visitor Exit
1. Guard opens Visitors Inside.
2. Finds the active visit.
3. Taps Check Out.
4. App records exit time, gate, and guard.
5. Visit is closed.

### Flow G — Domestic Help / Repeat Service Visitor
1. Guard searches the registered person.
2. App displays current permission, schedule, and blocked/revoked status where supported.
3. Guard follows the configured access policy.
4. Entry and exit are recorded.
5. Access schedules and exceptions require sponsor confirmation.

## 7. Visitor Categories

The system should support configurable categories rather than hardcoding a fixed list. Initial examples:

- Resident / family member
- Resident vehicle
- Personal guest
- Domestic help
- Regular staff or service provider
- Food delivery
- Courier / parcel delivery
- Contractor or other service provider
- Other / category to be configured later

Each category may have a policy for:
- Whether resident approval is required
- Whether pre-approval is supported
- Whether identity checks or photos are required
- Whether the person may enter or must remain at the gate
- Default maximum stay
- Whether an extension is permitted and by whom
- Whether entry/exit tracking is required

## 8. Visit Duration and Alerts

- Admin defines the default maximum time inside for each category.
- Example discussed: food delivery may have a 30-minute default. This is illustrative, not a confirmed society policy.
- Guard may extend a visit only within the authorised rules.
- An extension should record the new deadline and, where required, the reason.
- Avoid repeated alerts for the same overdue visit. A sensible prototype can show one overdue alert and an updated deadline after extension.
- Final limits, escalation, and extension permissions must be confirmed with the sponsor.

## 9. RFID Hardware Integration Boundary

Treat RFID as an integration dependency, not as an assumed implementation detail.

Before promising functionality, collect:
- Reader manufacturer and model
- Controller manufacturer and model
- Card/tag technology and credential format, if available
- Vendor API/SDK documentation
- Authentication and network requirements
- Supported operations: card assignment/revocation, access-event retrieval, live event notifications, access decisions, and gate-open commands
- Test device or sandbox access
- Existing access-control software and who operates it

Potential integration levels:
1. **Read-only visibility:** app displays events/logs exposed by the existing system.
2. **Credential synchronisation:** app manages card assignments or permissions through supported interfaces.
3. **Gate control:** app/system sends commands to open a gate through a supported controller interface.

Do not assume all levels are available. Do not put a mobile app in the time-critical RFID-to-gate path unless the sponsor, hardware vendor, and design explicitly require and support it. Confirm offline behaviour with the hardware vendor rather than inventing it.

## 10. Security, Privacy, and Auditability

- Enforce role-based access in the backend, not only in the UI.
- Record who performed an action and when: approvals, rejections, check-ins, check-outs, manual decisions, overrides, and administrative changes.
- Use clear and distinct states; do not infer approval from a phone call or from a QR code's appearance.
- Minimise collection and display of personal data.
- Confirm which visitor identity fields and photos are required, who can view them, and how long they are retained.
- Do not assume Aadhaar is mandatory. Any government-ID workflow must be reviewed against the society's policy and applicable requirements.
- Define a policy for failed notifications, network outages, and unavailable residents before production use.
- The prototype must use fictional sample data.

## 11. Error and Exception States to Design

At minimum, include UI states for:
- QR/pass invalid, expired, already used, or not found
- Visitor not found
- Resident/flat not found
- Approval pending
- Approval rejected
- Resident unavailable/no response
- Network unavailable or backend error
- Duplicate check-in attempt
- Visitor already checked out
- RFID integration unavailable (if that integration is shown in the prototype)
- Parcel held at gate / collected / handed over

For a prototype, display clear messages and safe next steps. Do not simulate real hardware control.

## 12. UI Principles

- Prioritise speed, legibility, and minimal typing.
- Use large touch targets suitable for a busy gate environment.
- Keep the active gate visible.
- Use text labels alongside icons and colours.
- Make the current decision and reason unmistakable.
- Prevent accidental entry/exit completion with a confirmation step when appropriate.
- Support search and repeat-visitor suggestions without silently selecting a person or flat.
- Keep delivery handover separate from visitor admission.
- Show demo data clearly as fictional.

## 13. Suggested Prototype Data

Use fictional examples such as:
- Gate: Gate 1 / Gate 2
- Flat: A-1204
- Visitor: “Demo Visitor”
- Category: Personal Guest / Food Delivery / Domestic Help
- Status: Pending Approval / Approved / Rejected / Checked In / Checked Out
- Pass: Demo-only QR code that does not grant real access

Never use real residents' names, phone numbers, photos, ID documents, or access credentials in a public mock-up.

## 14. Open Questions for Sponsor

1. What is the make/model of the RFID reader and controller, and can the vendor provide API/SDK documentation?
2. Should the new software control gate opening, synchronise card permissions, display logs, or some combination?
3. Does the existing hardware/controller continue to validate authorised cards when internet connectivity is unavailable?
4. What is the precise rule for a guest on the list but without a pass?
5. Which visitor categories may enter, and which must remain at the gate?
6. What data is mandatory at registration for each category?
7. What should happen if the resident does not respond or the notification fails?
8. What are the approved visit-duration limits and extension permissions?
9. Who may view visitor photos, ID data, and historical records?
10. What are the retention and deletion policies for visitor records?
11. Are there existing society-management systems or data sources to integrate?
12. Who signs off on the mock-up and the final acceptance criteria?

## 15. Out of Scope for the Initial Mock-up

- Supplying or installing physical readers, RFID cards, controllers, or barriers
- Guaranteeing RFID compatibility before vendor documentation and testing
- Production-grade backend and authentication implementation
- Live WhatsApp delivery or OTP integration
- Real QR credential issuance and validation
- Real gate-open commands
- Final offline access-control behaviour
- Final privacy, retention, and legal compliance policy

## 16. Definition of a Useful First Mock-up

The clickable mock-up is ready for sponsor review when:
- The guard can identify the active gate immediately.
- A pre-approved visitor can be processed end to end.
- An unlisted visitor can be registered and moved through pending, approved, and rejected states.
- No pending or rejected visitor is shown as admitted.
- A phone-based decision is explicitly recorded.
- Delivery-at-gate and parcel collection are distinct from visitor admission.
- The guard can see visitors inside and check one out.
- Category-based visit limits are visible as configurable settings or placeholders.
- RFID functionality is clearly marked as dependent on existing hardware and vendor integration.
- Open decisions are documented for the sponsor to validate.

---

## Implementation Note

Start with a **clickable UI prototype using fictional data**. Keep integration points behind clear interfaces so the actual RFID provider, notification service, and backend can be connected after requirements are confirmed. Build only the behaviours validated by the sponsor; mark assumptions visibly rather than embedding them as fixed business rules.
