# Free-Resource Popup — Setup & Dynamics 365 Wiring

This adds a lead-magnet popup to the site: a visitor picks a topic
(**Family Business**, **Business Advisement**, or **Succession Planning**),
enters name + email, and the matching PDF downloads instantly while the lead is
sent to Dynamics 365 and a Google Ads lead conversion fires.

## What was added

- `src/ResourcePopup.jsx` — the popup component (topic picker → form → instant download).
- `src/App.jsx` — renders `<ResourcePopup />` near the top of the page.
- `public/resources/` — the three guide PDFs, served at `/resources/...`.

The popup auto-opens once per visitor (after ~25s, or on exit-intent), and a
persistent **"Free Guides"** button sits in the bottom-right so it's always
reachable. "Seen" state is remembered in `localStorage`.

It works out of the box today: the PDF downloads and the conversion fires. The
only thing to connect is where the **lead record** lands — Dynamics 365.

## Connect leads to Dynamics 365 (recommended: Power Automate)

This is the simplest reliable path from a static site to D365 — no CORS or
API-auth headaches in the browser.

1. Go to **make.powerautomate.com** → **Create** → **Instant cloud flow**.
2. Trigger: **When an HTTP request is received**. Save once to generate the URL.
3. Paste this JSON schema so the flow knows the fields:

   ```json
   {
     "type": "object",
     "properties": {
       "name":       { "type": "string" },
       "email":      { "type": "string" },
       "company":    { "type": "string" },
       "phone":      { "type": "string" },
       "topic":      { "type": "string" },
       "topicLabel": { "type": "string" },
       "guide":      { "type": "string" },
       "source":     { "type": "string" },
       "pageUrl":    { "type": "string" },
       "submittedAt":{ "type": "string" }
     }
   }
   ```

4. Add a **Dataverse → Add a new row** action into the **Leads** table
   (or Contacts). Map:
   - Topic/Last Name/Subject ← `name`
   - Email ← `email`
   - Company Name ← `company`
   - Business Phone ← `phone`
   - Topic of Interest (or Description) ← `topicLabel` / `guide`
   - Lead Source ← `source`
5. **Save**, then copy the trigger's **HTTP POST URL**.
6. Open `src/ResourcePopup.jsx` and paste it into:

   ```js
   const LEAD_ENDPOINT = "https://prod-XX.westus.logic.azure.com/workflows/...";
   ```

That's it. Every submission now creates a lead in Dynamics 365.

### Alternative: Dynamics 365 Customer Insights – Journeys form
If you prefer a native marketing form, create a real-time marketing form in
D365 and use its endpoint / form-capture instead of the Power Automate URL.
The popup only needs a URL that accepts a JSON `POST`.

## Optional: a dedicated Google Ads "lead" conversion

Right now the popup fires the standard GA4 `generate_lead` event. To count it as
its own Google Ads conversion (separate from booking a call):

1. In Google Ads, create a new **conversion action** (category: *Submit lead form*).
2. Copy its send-to label (looks like `AW-18291211119/AbCdEfGh`).
3. In `src/ResourcePopup.jsx`, set:

   ```js
   const LEAD_CONVERSION_SEND_TO = "AW-18291211119/AbCdEfGh";
   ```

## Delivery: instant download now, email later

Today the guide downloads instantly on submit (highest conversion). To also
**email** the PDF, add a step to the same Power Automate flow: *Send an email
(V2)* with the guide attached or linked, using the `email` and `guide` fields.
No site changes needed.

## Tuning

In `src/ResourcePopup.jsx`:
- `AUTO_OPEN_DELAY_MS` — delay before the timed popup (default 25000).
- `SEEN_KEY` — bump the version suffix to re-show the popup to returning visitors.
- `TOPICS` — edit labels, blurbs, or PDF filenames.

## Deploy

Commit and push as usual; the PDFs in `public/resources/` ship with the build.
```bash
npm run build   # outputs to dist/
```
