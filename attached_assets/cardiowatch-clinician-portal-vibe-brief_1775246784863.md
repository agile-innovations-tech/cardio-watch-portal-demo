# CardioWatch AI — Clinician Web Portal
## Functional Mock-Up Build Brief for Vibe Coding Platform

**Document Type:** Build Brief — Functional Mock-Up
**Intended Audience:** AI-Assisted Development Platform (e.g., Replit, Bolt, Lovable)
**Status:** Draft

---

## 1. What We Are Building — And What We Are Not

### 1.1 Purpose

We are building a **functional mock-up** of a clinical web portal for a fictitious cardiac monitoring product called **CardioWatch AI**. The purpose of this mock-up is to support a software engineering demo — specifically, to demonstrate how a medical device software development team might use Jira to manage their work, and how automated testing integrates with Jira's test management features.

This is **not a real product**. It will never be used in clinical care, deployed to real patients, or connected to any real hardware or backend systems. Everything in this application is for show.

### 1.2 What "Functional Mock-Up" Means Here

| Requirement | Target |
|---|---|
| **Looks real** | ✅ Yes — production-grade visual design, realistic data |
| **Feels real** | ✅ Yes — real UI interactions, navigation, state changes |
| **Is real** | ❌ No — no actual backend, no real data, no real AI |
| **Has real tests** | ✅ Yes — runnable unit test suite, CI-compatible |

Specifically:
- All data displayed in the portal should be **realistic-looking dummy data** (fake patient names, plausible ECG event descriptions, believable timestamps, realistic confidence scores, etc.)
- All "AI" outputs (arrhythmia classifications, confidence scores, trend analyses) should be **hardcoded or randomly generated** from a plausible range — there is no real AI model behind them
- All actions the user takes (confirming an event, adjusting a threshold, downloading a report) should **appear to work** — state should update in the UI — but no data is persisted anywhere and no external calls are made
- The application should be **self-contained** — it should run entirely in the browser with no backend server required, or with a minimal local mock server if the chosen approach requires one

### 1.3 Why It Needs to Look Real

This mock-up will be demonstrated to software engineering managers and QA leads in the medical device industry. The audience is technically sophisticated. The portal needs to be convincing enough that a viewer watching a live demo will believe they are looking at a real clinical application — even if they are not interacting with it directly. Generic placeholder UI, obviously fake data, or unpolished design will undermine the credibility of the demo.

**Invest in the visual design. Make it look like a product someone paid for.**

---

## 2. Implementation Decisions

The choice of language, framework, build tooling, styling approach, charting library, and project structure is left entirely to the vibe coding platform. Use whatever stack will produce the best result for this type of application.

The following constraints are **non-negotiable** and must be satisfied regardless of stack choice:

- The application must run in a standard modern web browser (Chrome, Firefox, Edge, or Safari)
- The development server must be startable with a single command
- The unit test suite must be runnable with a single command, headlessly, with no browser window required
- The test suite must produce a **JUnit XML report file** on every test run — see Section 5 for details
- The test run must exit with a zero exit code on all-pass and a non-zero exit code on any failure
- The test run must complete within 5 minutes on a standard CI runner

Everything else — language, framework, file structure, naming conventions, styling methodology — is an implementation decision for the platform to make.

---

## 3. Visual Design Direction

### 3.1 Aesthetic

The portal is used by cardiologists, cardiac nurses, and clinical administrators in a hospital or specialty practice setting. The design should feel:

- **Clinical and authoritative** — this is a medical application, not a consumer app. Trust and precision are the primary emotional registers.
- **Dense but organized** — clinicians are power users managing large patient panels. Information density is appropriate; clutter is not.
- **Data-forward** — charts, tables, and waveforms should be prominent and beautifully rendered. The data is the product.

Avoid purple gradients, soft pastels, playful rounded corners, and anything that reads as "consumer startup SaaS." The visual language should communicate institutional trust and clinical seriousness.

### 3.2 Color

Use a cohesive color system built around a dominant dark accent color (deep navy, dark slate, or dark teal are all appropriate) on a light base (white and light gray backgrounds). The system must include distinct semantic colors for:

- **Critical / high severity** — a strong red
- **Warning / moderate severity** — a strong amber or orange
- **Stable / normal / confirmed** — a strong green
- **Neutral / informational** — a muted blue or gray

These semantic colors must be applied consistently across badges, alerts, status indicators, and chart elements throughout the application.

### 3.3 Typography

Use a font pairing that conveys precision and clinical authority. A clean, technical sans-serif works well for headings and UI labels. A monospaced or tabular-numeric font is appropriate for numeric data, ECG timestamps, confidence scores, and heart rate values.

Avoid generic or ubiquitous system fonts and avoid decorative or novelty fonts. The goal is typographic character without sacrificing legibility.

### 3.4 Layout

- A persistent navigation sidebar (collapsible) for primary navigation between screens
- A top header bar showing the current user identity, practice name, and a notification indicator
- Main content area with card-based content panels
- Responsive down to 1024px width minimum (tablet landscape)

---

## 4. Application Features

Build all screens and features described below. All data is dummy data. All actions update local UI state only — nothing is persisted between page loads.

### 4.1 Authentication Screen

A clean login screen with Email and Password fields and a "Sign In" button. Include a "Forgot password?" link that does nothing. On submit with any non-empty credentials, navigate to the dashboard. No real authentication is required.

Include the CardioWatch AI logo/wordmark (a simple generated logo is fine — a stylized heartbeat line through the letters CW is a reasonable approach). Include the disclaimer text: *"Authorized clinical users only. Access is logged and monitored."*

---

### 4.2 Patient Population Dashboard

The home screen and the most important screen in the portal.

**Summary Statistics Bar (top of page):**
- Total monitored patients (e.g., 142)
- Patients with unreviewed critical events (e.g., 7) — displayed with a red badge
- Patients with unreviewed moderate events (e.g., 23) — orange badge
- Average monitoring compliance rate across panel (e.g., 91%)
- Last data refresh timestamp

**Patient Table — columns:**
- Patient name (anonymized-realistic: "Eleanor Voss", "Marcus Tran", etc. — generate at least 30 dummy patients)
- MRN (fake, 8-digit)
- Age
- Diagnosis (e.g., "Paroxysmal AF", "Unexplained syncope", "Suspected Brady")
- Monitoring status badge: Active / Paused / Setup Incomplete
- Device battery % (shown as a small progress bar or indicator)
- Last data received (relative time: "4 min ago", "2 hrs ago", "Yesterday")
- Unreviewed events count (color-coded badge: red for critical, orange for moderate, gray for none)
- Last reviewed (date)
- Actions: "Review" button that navigates to the patient detail screen

**Sorting and Filtering:**
- Default sort: unreviewed critical events descending (sickest patients first)
- Filter controls: by severity (Critical / Moderate / All), by monitoring status, by assigned clinician
- Search bar: filters by patient name or MRN

The table must feel like a real clinical worklist — use realistic patient names, plausible diagnoses, varied monitoring durations, and a mix of severity states.

---

### 4.3 Patient Detail

A detailed view for a single patient, reachable from the dashboard Review button.

**Patient Header (persistent across all tabs):**
- Patient name, age, sex, MRN, diagnosis
- Monitoring start date, total monitoring days
- Device model (e.g., "Apple Watch Series 9"), battery %, last sync
- Assigned clinician name and credentials
- Quick-action buttons: "Generate Report", "Adjust Thresholds", "Message Care Team" (all simulated)

**Tab navigation within the patient view:** Events | ECG Viewer | Trends | History | Settings

---

#### 4.3.1 Events Tab (default tab)

A queue of all AI-flagged cardiac events for this patient, newest first.

**Each event entry shows:**
- Event timestamp (date and time)
- AI Classification (e.g., "Atrial Fibrillation", "Bradycardia", "Sinus Tachycardia", "Pause Detected")
- AI Confidence Score — displayed as a percentage with color-coded styling: ≥90% green, 70–89% amber, below 70% red
- Episode duration (e.g., "4 min 32 sec")
- Heart rate during event (e.g., "HR: 148 bpm")
- Detection source: "On-Device" or "Cloud AI"
- Status badge: Unreviewed | Confirmed | Dismissed | Reclassified
- A miniature ECG thumbnail or sparkline (does not need to represent real signal — it just needs to look like one)
- Action buttons: "Confirm", "Dismiss", "Reclassify", "View Full ECG"
  - Clicking Confirm or Dismiss updates the status badge immediately in the UI
  - Reclassify opens a dropdown with alternative rhythm labels
  - View Full ECG navigates to the ECG Viewer tab with this event pre-selected

Generate at least 15–20 dummy events per patient, with a realistic mix of classifications, confidence scores, and review statuses.

---

#### 4.3.2 ECG Viewer Tab

A simulated ECG waveform viewer. This does not need to process or render a real ECG signal — it needs to **look convincingly like one**.

**Waveform rendering guidance:**
- Generate a plausible-looking waveform using SVG or canvas, using a mathematical approach that produces PQRST-like shapes (sharp R-wave spikes, gentle P and T waves, a flat or slightly noisy baseline)
- Display a calibration grid behind the waveform — light gridlines at the minor division, slightly darker at the major division — in the style of standard ECG graph paper
- Show a time axis (seconds) and amplitude axis (mV)
- Choose either a classic paper ECG style (dark trace on cream/light grid) or a monitor style (bright green trace on near-black background) — pick one and commit to it

**Controls:**
- Playback speed selector: 25 mm/s | 50 mm/s (cosmetic only)
- Gain selector: 5 mm/mV | 10 mm/mV | 20 mm/mV (cosmetic only)
- Zoom in / Zoom out
- Annotation overlay toggle (shows/hides AI classification labels above the waveform)
- Jump-to-event buttons, one per flagged event — clicking highlights that region of the waveform

**Event Highlight:**
When an event region is selected, overlay a semi-transparent colored band on that portion of the waveform, with a label showing the AI classification and confidence score.

---

#### 4.3.3 Trends Tab

Long-term trend visualizations for the patient. All data is dummy data. All charts must have titles, labeled axes, a legend, and a tooltip on hover.

**Charts to include:**

1. **AF Burden Over Time** — percentage of time in AF per day, last 30 days (line or area chart)
2. **Heart Rate Distribution** — histogram of HR measurements over last 30 days, with reference lines at the bradycardia threshold (<50 bpm) and tachycardia threshold (>100 bpm)
3. **Event Frequency** — count of flagged events per day, last 30 days, color-coded by severity (bar chart)
4. **Monitoring Compliance** — percentage of each day the device was worn and transmitting (area chart)

Use the application's color palette for all charts — not the charting library's default color scheme.

---

#### 4.3.4 History Tab

A chronological audit log for this patient — a feed of everything that has happened during the monitoring period.

**Each entry shows:**
- Timestamp
- Actor: a clinician name, "System", or "Patient"
- Action description (e.g., "Confirmed AF event at 14:32 — annotated: 'Consistent with known paroxysmal AF pattern'", "Alert threshold adjusted: Brady threshold changed from 45 bpm to 50 bpm", "Automated report generated and sent to referring physician")

Generate at least 25 dummy history entries spanning the monitoring period. Include examples of clinician actions, system-generated events, and patient-triggered events.

---

#### 4.3.5 Settings Tab (Per-Patient Alert Thresholds)

A form showing configurable monitoring parameters for this specific patient.

**Fields:**
- Bradycardia alert threshold (bpm) — numeric input, range 30–60
- Tachycardia alert threshold (bpm) — numeric input, range 90–180
- AF detection sensitivity — dropdown: High | Standard | Conservative
- Pause detection threshold (seconds) — numeric input, range 2.0–5.0
- Caregiver escalation delay (minutes) — numeric input, range 5–60
- Emergency escalation enabled — toggle
- Monitoring paused — toggle, with a date picker for resume date that appears when the toggle is enabled

A "Save Changes" button that shows a success notification when clicked (no data is actually saved).

---

### 4.4 Report Generation (Simulated)

When the user clicks "Generate Report" from the patient detail header:

1. Show a modal or panel with options:
   - Report period: Last 7 days | Last 30 days | Custom date range
   - Include sections: Summary | Event Log | ECG Excerpts | Trend Charts (each a checkbox)
   - Recipient: Ordering Physician | Referring Specialist | Insurance/Prior Auth | Download Only
2. A "Generate" button that shows a brief loading state (1–2 seconds)
3. After the delay, show a success message: "Report generated successfully. Download will begin shortly."
4. Open a print dialog or display a static formatted report page — whichever is simpler to implement. It does not need to be a real PDF with real data.

---

### 4.5 Population-Level Analytics Screen

An aggregate reporting view across the entire monitored patient panel.

**Summary metric cards (top of screen):**
- Total patient-days of monitoring (e.g., 4,281)
- Total AI-flagged events (e.g., 1,847)
- Events confirmed by clinician, with percentage (e.g., 1,203 — 65%)
- Events dismissed, with percentage (e.g., 644 — 35%)
- Average review turnaround time (e.g., 3.2 hours)
- Average panel monitoring compliance (e.g., 88%)

**Charts:**
1. Event volume over time — total AI-flagged events per day, last 90 days (line chart)
2. Classification breakdown — proportion of events by type: AF, Bradycardia, Tachycardia, Pause, Other (donut or pie chart)
3. Review turnaround time distribution — histogram
4. Monitoring compliance by patient — horizontal bar chart, anonymized patient identifiers on the Y axis, sorted ascending

**Data Export button** — shows a notification: "Export initiated. You will receive an email when the file is ready." No actual export occurs.

---

### 4.6 User Account and Practice Settings Screen

Two sub-sections:

**My Profile:**
- Display name, email, role (e.g., "Attending Cardiologist"), NPI number
- Password change form that does nothing on submit
- Notification preferences: toggles for email alerts, SMS alerts, in-app alerts

**Practice Administration** (visible only for the Admin role — implement a simple role switcher in the header for demo purposes, so a presenter can toggle between clinician and admin views):
- Practice name, address, NPI
- User management table: list of clinical users, their roles, last login, and active/inactive status
- "Invite User" button that opens a modal with an email field — does nothing on submit
- EHR Integration status panel showing a fake "Connected to Epic" status with a green indicator and last sync timestamp

---

### 4.7 Notification Panel

A slide-out notification drawer triggered by a bell icon in the header. The bell should show an unread count badge.

Show 8–12 dummy notifications, for example:
- "🔴 CRITICAL: New AF event detected — Eleanor Voss (2 min ago)"
- "🟠 MODERATE: Tachycardia episode — Marcus Tran (14 min ago)"
- "✅ Report generated for James Okello (1 hr ago)"
- "⚙️ Device offline — Patricia Huang (3 hrs ago)"
- "🔵 New patient onboarded — Raymond Kessler (Yesterday)"

Each notification is clickable and navigates to the relevant patient or screen. Include a "Mark all as read" button and a dismiss button on each individual notification. The unread badge count on the bell icon should decrease as notifications are dismissed.

---

## 5. Unit Test Suite

### 5.1 Requirements Overview

The application must include a unit test suite that meets the following requirements:

| Requirement | Specification |
|---|---|
| Total test count | **300 or more** individual test cases |
| Test output format | **JUnit XML** — required for Xray for Jira Cloud import |
| CI compatibility | Tests run headlessly with a single command; JUnit XML file is produced automatically |
| Exit behavior | Exit code 0 on all-pass; non-zero on any failure |
| Completion time | Under 5 minutes on a standard CI runner |

### 5.2 JUnit XML Output Requirement

The test runner must produce a JUnit XML report file at a consistent, documented path in the project on every test run. This file will be imported into Xray for Jira Cloud as test execution evidence.

The JUnit XML file must be valid and parseable by Xray. Standard JUnit XML format — with `<testsuite>` and `<testcase>` elements — is what Xray expects.

The output directory should be excluded from version control but created automatically during test runs.

Choose whatever test framework and reporting tooling best supports JUnit XML output for the selected stack. The only requirement is that the output file is produced consistently and is Xray-compatible.

### 5.3 CI Invocation

Document a single command that runs the full test suite and produces the JUnit XML report. This command must work in a headless CI environment — no display, no browser window required.

### 5.4 Test Naming Conventions

Use descriptive names for test groups and individual test cases. These names will appear as test identifiers in Jira, so they must be meaningful to a human reader. For example:

- Group name: `Patient Population Dashboard — sorting and filtering`
- Test name: `displays a red badge for patients with unreviewed critical events`

Avoid names like `test 1`, `should work`, or `renders correctly` with no qualifying context.

### 5.5 Test Coverage Areas

Distribute the 300+ tests across all major application areas. The tests do not need to be exhaustive or deeply validating — they need to exist, run, pass, and cover the features described in Section 4. The goal is a large, realistic-looking test suite that demonstrates disciplined software engineering practice.

Organize tests into logical groups and meet or exceed the test counts shown below.

---

#### Authentication — 15 tests
- Login screen renders without crashing
- Email field is present and accepts input
- Password field is present, accepts input, and masks characters
- Submit button is present and correctly labeled
- Submitting with an empty email shows a validation error
- Submitting with an empty password shows a validation error
- Submitting with non-empty credentials navigates to the dashboard
- Submitting an empty form does not navigate
- "Forgot password?" link is present
- The page title is correct
- The CardioWatch AI logo is rendered
- The authorized-use disclaimer text is present
- The email field has an accessible label
- The password field has an accessible label
- The password field type prevents characters from being visible

---

#### Patient Population Dashboard — 40 tests
- Dashboard renders without crashing
- Summary statistics bar is present
- Total patient count is displayed
- Critical event badge is displayed
- Moderate event badge is displayed
- Panel compliance rate is displayed
- Last refresh timestamp is displayed
- Patient table renders
- Patient table has the correct column headers (one test per column)
- At least one patient row is rendered
- At least 30 patient rows are rendered
- Patient name is shown in each row
- MRN is shown in each row
- Monitoring status badge is present in each row
- Critical event badge uses red styling
- Moderate event badge uses amber or orange styling
- "Review" button is present in each row
- Clicking "Review" navigates to the patient detail screen
- Search bar is present
- Entering a search term filters the table
- Clearing the search restores the full table
- Filtering by "Critical" shows only patients with critical events
- Filtering by "Moderate" shows only patients with moderate events
- Filtering by "All" restores the full list
- Default table sort is by unreviewed critical events descending
- Clicking a column header sorts by that column

---

#### Patient Detail — Header and Navigation — 25 tests
- Patient detail screen renders without crashing
- Patient name is displayed in the header
- Patient MRN is displayed
- Patient age and sex are displayed
- Diagnosis is displayed
- Monitoring start date is displayed
- Total monitoring days are displayed
- Device model is displayed
- Battery percentage is displayed
- Last sync time is displayed
- "Generate Report" button is present
- "Adjust Thresholds" button is present
- Tab navigation is present
- The "Events" tab is active by default
- Clicking the "ECG Viewer" tab makes it the active tab
- Clicking the "Trends" tab makes it the active tab
- Clicking the "History" tab makes it the active tab
- Clicking the "Settings" tab makes it the active tab
- Clicking back to the "Events" tab re-renders the event list
- The patient header persists across all tab changes
- An invalid patient identifier shows an error state
- The page title reflects the patient's name
- The assigned clinician's name is displayed
- "Message Care Team" button is present
- Navigation back to the dashboard is available

---

#### Event Review Queue — 50 tests
- Event queue renders without crashing
- At least 15 events are displayed for a patient
- Each event entry displays a timestamp
- Each event entry displays an AI classification label
- Each event entry displays a confidence score
- A confidence score of 90% or above uses green styling
- A confidence score between 70% and 89% uses amber styling
- A confidence score below 70% uses red styling
- Each event entry displays the episode duration
- Each event entry displays the heart rate
- Each event entry displays the detection source label
- Each event entry displays a status badge
- New events show an "Unreviewed" status badge
- "Confirm" button is present on unreviewed events
- "Dismiss" button is present on unreviewed events
- "Reclassify" button is present on unreviewed events
- "View Full ECG" button is present on each event
- Clicking "Confirm" changes the event status to "Confirmed"
- Clicking "Confirm" removes the "Unreviewed" badge
- Clicking "Dismiss" changes the event status to "Dismissed"
- Confirmed events show a "Confirmed" badge with green styling
- Dismissed events show a "Dismissed" badge with muted styling
- Clicking "Reclassify" opens a reclassification dropdown
- The reclassification dropdown contains at least 5 rhythm label options
- Selecting a reclassification label updates the event's classification
- A reclassified event shows a "Reclassified" status badge
- Events are sorted newest first by default
- An ECG thumbnail or sparkline is rendered for each event
- Clicking "View Full ECG" navigates to the ECG Viewer tab
- Filtering by "Unreviewed Only" hides confirmed and dismissed events
- Filtering by "Confirmed" shows only confirmed events
- Filtering by "All" shows all events regardless of status
- AF classification events show "Atrial Fibrillation" or equivalent label
- Bradycardia events show "Bradycardia" or equivalent label
- Tachycardia events show "Sinus Tachycardia" or equivalent label
- Pause events show an appropriate label
- The event queue shows the total event count
- The event queue shows the unreviewed event count
- A batch "mark reviewed" action or equivalent is present
- Long annotation text is handled gracefully (truncated or scrollable)
- A clinician can add an annotation to an event
- The annotation is reflected in the event display after entry
- An expandable event entry reveals additional detail
- Collapsing an expanded entry hides the additional detail
- Confirming an already-confirmed event does not cause a crash
- Event entries render correctly when all fields are populated
- Event entries render correctly when optional fields are absent
- "View Full ECG" button has an accessible name
- The confidence score is a numeric value between 0 and 100

---

#### ECG Viewer — 30 tests
- ECG viewer tab renders without crashing
- A waveform rendering element is present
- The waveform has non-zero dimensions
- A time axis is rendered with labels
- An amplitude axis is rendered with labels
- A calibration grid is rendered
- Playback speed selector is present
- Playback speed selector includes a "25 mm/s" option
- Playback speed selector includes a "50 mm/s" option
- Gain selector is present
- Gain selector includes at least three options
- A zoom-in control is present
- A zoom-out control is present
- An annotation overlay toggle is present
- Toggling annotations changes their visibility on the waveform
- Jump-to-event controls are present
- At least one jump-to-event control corresponds to a flagged event
- Clicking a jump-to-event control highlights a waveform region
- The highlighted region is visually distinct from the surrounding waveform
- An AI classification label appears on the highlighted region
- A confidence score appears on the highlighted region
- Changing the speed setting does not crash the viewer
- Changing the gain setting does not crash the viewer
- The waveform area has an accessible role or label
- The viewer renders correctly at 1024px viewport width
- The viewer renders correctly at 1440px viewport width
- A waveform path is present in the rendered output
- Grid lines are present in the rendered output
- The viewer mounts without errors
- Selecting a different event changes the highlighted region

---

#### Trends Tab — 30 tests
- Trends tab renders without crashing
- AF Burden chart is present
- AF Burden chart has a title
- AF Burden chart renders with 30 data points
- AF Burden Y axis represents percentage (0–100)
- AF Burden X axis has date labels
- Heart Rate Distribution chart is present
- Heart Rate Distribution chart has a title
- Heart Rate Distribution chart has a bradycardia reference line
- Heart Rate Distribution chart has a tachycardia reference line
- Heart rate distribution data spans a plausible range (30–200 bpm)
- Event Frequency chart is present
- Event Frequency chart has a title
- Event Frequency bars are color-coded by severity
- Event Frequency chart has 30 data points
- Monitoring Compliance chart is present
- Monitoring Compliance chart has a title
- Monitoring Compliance values are between 0 and 100
- All charts have a legend
- All charts have labeled axes
- Chart tooltips appear on hover
- Charts use the application color palette, not default library colors
- Charts render without errors when all data values are zero
- Charts render without errors when all data values are at maximum
- The trends tab displays a date range label (e.g., "Last 30 days")
- The trends tab has a date range selector
- Changing the date range causes the charts to re-render
- All charts are responsive to their container width
- Charts mount without errors
- All chart containers have a defined minimum height

---

#### History Tab — 20 tests
- History tab renders without crashing
- At least 25 history entries are displayed
- Each entry has a timestamp
- Each entry has an actor label
- Each entry has an action description
- System-generated entries are labeled as "System"
- Clinician entries show the clinician's name
- Patient-triggered entries are labeled as "Patient"
- Entries are sorted with newest first
- The history tab shows the total entry count
- The history entry list is scrollable
- Long action descriptions are fully readable
- A filter control for actor type is present
- Filtering by "Clinician" shows only clinician-generated entries
- Filtering by "System" shows only system-generated entries
- Filtering by "All" restores all entries
- An entry for a clinician event confirmation is present in the dummy data
- An entry for a threshold change is present in the dummy data
- An entry for a report generation action is present in the dummy data
- The history tab renders without crashing when there are zero entries

---

#### Settings Tab — 25 tests
- Settings tab renders without crashing
- Bradycardia threshold input is present
- Bradycardia threshold is a numeric input
- Bradycardia threshold has a minimum of 30
- Bradycardia threshold has a maximum of 60
- Tachycardia threshold input is present
- Tachycardia threshold is a numeric input
- Tachycardia threshold has a minimum of 90
- Tachycardia threshold has a maximum of 180
- AF sensitivity dropdown is present
- AF sensitivity dropdown includes "High"
- AF sensitivity dropdown includes "Standard"
- AF sensitivity dropdown includes "Conservative"
- Pause detection threshold input is present
- Caregiver escalation delay input is present
- Emergency escalation toggle is present
- Monitoring paused toggle is present
- Enabling the monitoring paused toggle reveals a date picker
- A date picker is present when monitoring is paused
- "Save Changes" button is present
- Clicking "Save Changes" displays a success notification
- The success notification contains a confirmation message
- The success notification disappears after a timeout
- The form retains entered values after a save action
- All form fields have accessible labels

---

#### Report Generation — 20 tests
- The report modal or panel opens when "Generate Report" is clicked
- The report modal has a title
- A report period selector is present
- "Last 7 days" is an available period option
- "Last 30 days" is an available period option
- "Custom date range" is an available period option
- Selecting "Custom date range" reveals start and end date inputs
- A "Summary" section checkbox is present and checked by default
- An "Event Log" section checkbox is present
- An "ECG Excerpts" section checkbox is present
- A "Trend Charts" section checkbox is present
- A recipient selector is present
- The recipient selector has at least 3 options
- A "Generate" button is present
- A "Cancel" button is present and closes the modal without generating
- Clicking "Generate" shows a loading state
- The loading state resolves after a brief simulated delay
- A success message is displayed after the loading state resolves
- The modal can be dismissed with the Escape key
- The modal closes automatically after a successful generation

---

#### Population Analytics — 25 tests
- Analytics screen renders without crashing
- Total patient-days metric is present
- Total patient-days displays a positive numeric value
- Total AI-flagged events metric is present
- Confirmed events metric is present
- Dismissed events metric is present
- Confirmed and dismissed percentages sum to 100%
- Average review turnaround metric is present
- Average compliance metric is present
- Event volume over time chart is present
- Event volume chart has 90 data points
- Event volume chart has a title
- Classification breakdown chart is present
- Classification breakdown includes an AF category
- Classification breakdown includes a Bradycardia category
- Classification breakdown includes a Tachycardia category
- Classification breakdown percentages sum to 100%
- Review turnaround distribution chart is present
- Monitoring compliance by patient chart is present
- Compliance chart is sorted ascending
- "Data Export" button is present
- Clicking "Data Export" shows a notification
- The notification references email delivery
- The analytics screen renders correctly at 1024px viewport width
- All summary metric values are positive numbers

---

#### Notification Panel — 15 tests
- A notification bell icon is present in the header
- Clicking the bell icon opens the notification drawer
- The notification drawer contains at least 8 notifications
- Each notification has a timestamp
- Each notification has a descriptive message
- Critical notifications use high-urgency (red) styling
- Moderate notifications use medium-urgency (amber) styling
- Informational notifications use neutral (blue or gray) styling
- Each notification has a dismiss button
- Clicking a dismiss button removes that notification from the list
- A "Mark all as read" button is present
- Clicking "Mark all as read" clears unread styling from all items
- Clicking a patient-related notification navigates to that patient
- The bell icon shows an unread count badge
- The unread count badge decreases when notifications are dismissed

---

#### Navigation and Routing — 15 tests
- The login route renders the authentication screen
- The dashboard route renders the patient population dashboard
- The patient detail route renders a detail screen for a valid patient identifier
- The analytics route renders the analytics screen
- The settings route renders the settings screen
- Accessing the dashboard without authentication redirects to login
- Accessing a patient detail screen without authentication redirects to login
- The sidebar navigation link for Dashboard is present
- The sidebar navigation link for Analytics is present
- The sidebar navigation link for Settings is present
- The currently active route is visually indicated in the sidebar
- Clicking "Dashboard" in the sidebar navigates to the dashboard
- Clicking "Analytics" in the sidebar navigates to the analytics screen
- The browser back button navigates correctly between visited screens
- The logo in the sidebar navigates to the dashboard

---

#### Accessibility Basics — 10 tests
- The login screen has a main content landmark
- The dashboard has a main content landmark
- All images have descriptive alternative text
- All form inputs have associated labels
- All buttons have accessible names
- Color-coded status badges convey their meaning in text, not color alone
- Modal dialogs have appropriate dialog roles and labels
- Focus is trapped within open modal dialogs
- The navigation sidebar has an appropriate navigation landmark
- The page title updates to reflect the current screen on navigation

---

## 6. Dummy Data Requirements

All dummy data should feel like it came from a real clinical system. Guidance:

- **Patient names:** Use realistic, diverse full names across a range of ethnicities and genders. Avoid obviously fake names ("John Doe", "Test Patient"). Generate 30 or more unique patients.
- **MRNs:** 8-digit numbers with a realistic prefix (e.g., "10042891")
- **Event timestamps:** Spread across the last 30–60 days. Use realistic times — nighttime timestamps (2 AM, 3 AM) are clinically plausible for atrial fibrillation.
- **Confidence scores:** Normally distributed around 85%, with some values in the low-to-mid 60s and a few at 95% or above.
- **Heart rates:** Bradycardia events in the 35–48 bpm range; tachycardia events in the 110–170 bpm range; AF events with irregular rates in the 90–140 bpm range.
- **Episode durations:** Range from 45 seconds to 14 hours for AF; shorter for tachycardia and bradycardia episodes.
- **Clinician names:** Use realistic names with credentials (e.g., "Dr. Sarah Okonkwo, MD", "Dr. James Ritter, MD", "Jennifer Calás, NP").
- **Chart data:** Generate plausible time series. AF burden should not be 0% or 100% every day. Compliance should vary between 70% and 99%.

---

## 7. README Requirements

Include a README file at the project root that contains:

1. A brief project overview stating that this is a CardioWatch AI Clinician Portal mock-up created for demonstration purposes only
2. Prerequisites needed to run the application (runtime version requirements, etc.)
3. A command to install dependencies
4. A command to start the development server
5. A command to run the test suite
6. The path where the JUnit XML test report file is written
7. A clear statement that this is a demonstration mock-up and not a real medical device application

---

## 8. Explicit Non-Requirements

Do **not** build the following — they are out of scope for this mock-up:

- A real backend API or database
- Real user authentication or session management
- Real AI model inference
- Real ECG signal processing
- Real PDF generation
- Real email or SMS delivery
- HIPAA-compliant data handling (no real patient data is involved)
- Real EHR system integration
- Responsive design below 1024px viewport width
- Internationalization or localization
- Accessibility beyond the basics covered in the accessibility test group above

---

*This document describes a fictitious product mock-up created for software demonstration purposes only. CardioWatch AI is not a real product. No real patient data is used or represented.*
