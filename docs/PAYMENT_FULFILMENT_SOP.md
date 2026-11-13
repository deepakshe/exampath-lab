# ExamPath Lab — Payment Fulfillment & Commercial Pilot SOP

**Phase:** Phase 1 (Pre-Commercial Pilot Validation)  
**Budget Preserved:** ₹2,000 intact (₹0 infrastructure cash burn)  
**Fulfillment Method:** Manual mentor verification via Email / WhatsApp

---

## 1. The Pilot Phase Principle

Before investing funds in paid payment gateway setup fees, commercial business accounts, or recurring SaaS fees, ExamPath Lab validates demand through controlled manual order fulfillment.

**Rules for the Pilot Phase:**
1. No automated payment gateway keys are embedded in frontend code or Git.
2. The UI never links to `#` as a fake checkout; buttons state **"Payments opening soon"** unless a real verified payment link is configured by the owner.
3. A browser URL redirect or query parameter is **NEVER** treated as proof of payment.
4. Premium PDF packs are never placed in `public/` or uploaded to public Git repositories.

---

## 2. Step-by-Step Manual Pilot Fulfillment SOP

When an aspirant wishes to purchase a weekly study pack during the pilot:

```
[Student Requests Pack via WhatsApp/Email]
                     │
                     ▼
[Owner Sends Official Payment Link / UPI QR Code]
                     │
                     ▼
[Student Completes Transaction & Submits Reference ID]
                     │
                     ▼
[Owner Inspects Payment Gateway / Bank Dashboard]
                     │
        ┌────────────┴────────────┐
   [Not Verified]             [Verified]
        │                         │
  [Ask for proof]        [Send PDF to student's]
                         [WhatsApp/Email within]
                         [2 to 6 hours with log]
```

### Manual Delivery Verification Checklist:
- [ ] Verify transaction ID exists in the merchant dashboard.
- [ ] Confirm amount matches the stated pack price (e.g. ₹49 or ₹199).
- [ ] Confirm buyer's phone number or email address.
- [ ] Send the encrypted/watermarked master PDF pack directly to the student.
- [ ] Log transaction in a secure internal spreadsheet (Date, Student Name, Pack Name, Transaction ID, Delivery Timestamp).

---

## 3. Phase 2: Future Automated Webhook Architecture

When weekly order volume exceeds 30 orders/week, automated delivery should be implemented using Cloudflare Workers and private R2 storage.

### Security Architecture for Future Webhooks:

1. **HMAC-SHA256 Signature Verification:**
   - Webhook endpoint (`/api/webhooks/razorpay`) must compute HMAC-SHA256 using the **raw request body** and the secret key.
   - Compare the computed digest against the HTTP header `X-Razorpay-Signature` using a timing-safe equality function.

2. **Anti-Replay Idempotency:**
   - Deduplicate events using `x-razorpay-event-id` stored in SQLite/D1 `webhook_events` table.
   - If an event ID has already been recorded, return `HTTP 200 OK` immediately without re-triggering entitlement creation.

3. **Storage & Delivery:**
   - Store premium PDFs in a private Cloudflare R2 bucket (`exampath-private-assets`).
   - Generate time-limited signed download URLs (valid for 60 minutes) delivered via automated transactional email (e.g. Cloudflare Email Workers or Resend).
   - Never expose public R2 links.
