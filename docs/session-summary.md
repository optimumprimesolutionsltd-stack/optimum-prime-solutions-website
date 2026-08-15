# Optimum Prime Solutions — System Knowledge Base
*Last updated: 7 July 2026*

---

## 1. Project Overview

**Website:** [www.optimumprimesolutions.co.ke](https://www.optimumprimesolutions.co.ke)
**Stack:** React + TypeScript + Tailwind CSS (Vercel) · Flask/Python (Render.com) · Firebase Realtime Database · Twilio WhatsApp API

| Component | Location | Deploy method |
|---|---|---|
| Frontend | GitHub: `optimumprimesolutionsltd-stack/optimum-prime-solutions-website` (branch: `main`) | Push to `main` → Vercel auto-deploys |
| Backend (notification server) | GitHub: `optimumprimesolutionsltd-stack/optimum-prime-lead-notifier` (branch: `master`) | Push to `master` → Render auto-deploys |
| Local website repo | `/home/ubuntu/website-repo` | — |
| Local server repo | `/home/ubuntu/lead-notifier-repo` | — |

---

## 2. Key Configuration

### Firebase
- **Project:** `optimum-prime-website`
- **Database URL:** `https://optimum-prime-website-default-rtdb.europe-west1.firebasedatabase.app`
- **Data nodes:** `leads/` (demo requests), `webinar_registrants/` (webinar signups), `chatHistory/`, `siteData/`

### WhatsApp (Twilio)
- **Sandbox FROM number:** `whatsapp:+14155238886`
- **Team alert numbers:** `+254758449475` (personal/Chege), `+254116246074` (business)
- **Pending:** Meta verification of `+254727209720` — when approved, switch to production WhatsApp API
- **Sandbox opt-in:** Each number must send `join <keyword>` to `+1 415 523 8886` on WhatsApp. Opt-ins expire after ~72 hours of inactivity — re-send the join message to renew.
- **Find keyword:** [console.twilio.com](https://console.twilio.com) → Messaging → Try it out → Send a WhatsApp message

### Notification Server (Render.com)
- **Base URL:** `https://optimum-prime-lead-notifier.onrender.com`
- **Endpoints:**
  - `POST /new-lead` — team alert + client WhatsApp reply
  - `GET /export-leads` — download demo leads as CSV
  - `GET /export-webinar` — download webinar registrants as CSV
  - `GET /health` — health check

---

## 3. Demo Request Form (`/contact#demo-form`)

### Fields (all mandatory except Message)
| Field | Type | Options / Notes |
|---|---|---|
| Full name | Text input | Required |
| Company name | Text input | Required |
| Phone | Tel input | Kenyan format validated (+254 / 0 / 254) |
| Email | Email input | Required |
| Business type | **Dropdown** | Retail, Wholesale/Distribution, Manufacturing, Construction, Hardware, School/Education, NGO/Non-profit, SACCO/Microfinance, Professional Services, Hospitality, Other |
| Current software | **Dropdown** | QuickBooks, Sage, Pastel, Excel/Manual, TallyPrime (older), Tally ERP 9, Odoo, SAP, None, Other |
| Preferred date | Date picker | Past dates blocked; Required |
| Preferred time | **Dropdown** | 8AM–5PM in 1-hour slots (EAT); Required |
| Message | Textarea | Optional — "Tell us about your needs..." |

### Form UX
- Sky-blue call-to-action banner at top: pulsing dot + "Step 1 — Fill in your details below"
- All "Book a Demo" / "Request a Demo" links across the site use `/contact#demo-form`
- ContactPage.tsx fires scroll-to-anchor at 200ms and 600ms after load (80px navbar offset)

### Notification Flow
1. Lead saved to Firebase `leads/`
2. POST to `https://optimum-prime-lead-notifier.onrender.com/new-lead`
3. Team alert sent to +254758449475 and +254116246074
4. Client receives WhatsApp confirmation with:
   - Date, time, business type, current software (personalised)
   - Google Meet link (deterministic hash, tied to booking details)
   - Google Calendar link
   - **Same-day booking:** "Your demo is today! We'll send you a reminder 30 minutes before your session."
   - **Future booking:** "We'll send you a reminder the day before and 30 minutes before your demo."

---

## 4. Webinar — TallyPrime 7.1

| Detail | Value |
|---|---|
| Date | Wednesday, 15th July 2026 |
| Time | 3:00 PM – 4:00 PM (EAT) |
| Venue | Online via Google Meet |
| Cost | FREE |
| Registration page | https://www.optimumprimesolutions.co.ke/webinar |
| **Google Meet link** | **https://meet.google.com/ded-fdcf-aac** |

**Topics:** Auto Wrap Text · Professional Invoice Print Templates (8 templates) · Scheduled Auto Backup · Reuse Deleted Voucher Numbers · Live Q&A

### Webinar Message Flow
1. **Invite (Message 1)** — sent manually via script to prospects
2. **Confirmation (Message 2)** — sent automatically when someone registers; includes the Meet link
3. **Day-of Reminder (Message 3)** — sent manually via script on 15th July

### Day-of Reminder Script
```bash
# Dry run (preview only)
python3 /home/ubuntu/send_webinar_reminder.py --dry-run

# Live run (sends to all registrants)
python3 /home/ubuntu/send_webinar_reminder.py
```
Run twice on 15th July: **9:00 AM EAT** and **2:30 PM EAT**

### Invite Script
```bash
# Edit name/phone/company inside the script first
python3 /home/ubuntu/send_webinar_invite.py
```

---

## 5. Admin Dashboard
- Protected by Firebase Authentication
- The "Checking admin access" loading screen has been **removed** — site loads instantly for all visitors
- Admin routes still redirect to login if unauthenticated (Firebase rules intact)

---

## 6. Zawadi Chatbot — Upgrade Approved (Pending)

**Current state:** Mock keyword-based responses — not connected to real AI.

**Approved upgrade plan:**
1. Add `/chat` endpoint to Render server (proxies LLM calls securely — API key stays server-side)
2. Replace mock responses in `getChatGPTReply` with real LLM calls via the Render proxy
3. Write comprehensive Zawadi system prompt (TallyPrime, Cloud, Biz Analyst, Kenya context, eTIMS, pricing)
4. Update "Talk to an Expert" buttons to open Zawadi chatbot first
5. Smart WhatsApp handoff — when user wants a human, Zawadi opens WhatsApp with conversation summary

---

## 7. All Committed Changes (This Session)

### Website Repo (`main` branch — Vercel)
| Commit | Change |
|---|---|
| `84df56f` | Fix: connect demo form to Render notification server for WhatsApp alerts |
| `f0dc33c` | Feat: demo form — dropdowns for business type & software, time slot picker, all fields mandatory |
| `3328c29` | UI: redesign demo form header with Step 1 call-to-action banner |
| `63c25b3` | Fix: improve demo-form scroll with retry and navbar offset |
| `05ba2f7` | Fix: scroll to #demo-form anchor on contact page load |
| `ecafb01` | Fix: remove "Checking admin access" screen; add #demo-form anchor to all demo links |
| `5ae8ba4` | Feat: add fixed Google Meet link to webinar confirmation message |
| `f4f7467` | Fix: replace India-specific footer banner with Kenya-relevant features |
| `0c722a7` | Fix: use full name in webinar WhatsApp confirmation (was splitting on space, returning "Mr." only) |

### Lead Notifier Repo (`master` branch — Render)
| Commit | Change |
|---|---|
| `e0b60d0` | Feat: customize reminder line for same-day demo bookings |
| `680bd05` | Feat: rewrite demo confirmation message — personalised, no duplicate, reminder promise |
| `4032e3e` | Docs: add webinar invite and day-of reminder scripts |

---

## 8. Outstanding Items

| Item | Status |
|---|---|
| Meta verification of +254727209720 | Pending — check at [business.facebook.com/wa/manage/phone-numbers](https://business.facebook.com/wa/manage/phone-numbers/) |
| +254116246074 not receiving messages | Sandbox opt-in likely expired — re-send `join <keyword>` to +1 415 523 8886 from that number |
| Zawadi AI upgrade | Approved — implementation pending (see Section 6) |
| Email confirmation (Gmail SMTP) | Not yet implemented |

---

## 9. Company Details

- **Name:** Optimum Prime Solutions Ltd
- **Tagline:** Certified TallyPrime Partner · Cloud Hosting · Biz Analyst
- **Phone:** +254 116 246 074
- **Email:** optimumprimesolutionsltd@gmail.com
- **Location:** Gacheru House, Ruiru Town, Ruiru, Kenya
- **Google Calendar service account:** optimum-demo-calendar@optimum-website-501609.iam.gserviceaccount.com

---

## 10. Quick Reference

| Task | Command / URL |
|---|---|
| Check server health | `curl https://optimum-prime-lead-notifier.onrender.com/health` |
| Export demo leads | `curl -o demo_leads.csv https://optimum-prime-lead-notifier.onrender.com/export-leads` |
| Export webinar registrants | `curl -o webinar.csv https://optimum-prime-lead-notifier.onrender.com/export-webinar` |
| Send webinar invite | `python3 /home/ubuntu/send_webinar_invite.py` |
| Send day-of reminder | `python3 /home/ubuntu/send_webinar_reminder.py` |
| Demo form direct link | https://www.optimumprimesolutions.co.ke/contact#demo-form |
| Webinar registration | https://www.optimumprimesolutions.co.ke/webinar |
| Webinar Meet link | https://meet.google.com/ded-fdcf-aac |
