// ── thebuildsystem · Supabase configuration ─────────────────────────────
// Fill these in after creating your free project at https://supabase.com
//
// 1. Create a project (Organization → New project).
// 2. Go to Project Settings → API.
// 3. Copy "Project URL" into SUPABASE_URL below.
// 4. Copy the "anon / public" key into SUPABASE_ANON_KEY below.
//    (Never use the "service_role" key here — that one is secret and
//    must never appear in a file the browser can read.)
//
// See README.md for the full setup walkthrough, including the SQL to run
// and how to deploy this folder to Vercel or Netlify.

const SUPABASE_URL = "https://gfmvcexeyjtjoxvjvpfu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MiKbEsz4Wv3wLj4YqtB98g_MfVFDKwd";

// ── Notifications on new coaching applications (optional) ───────────────
// Leave these as "" to skip — applications still get saved to Supabase
// either way, you just won't get pinged. Fill them in to also get a
// WhatsApp message + an email every time someone submits apply.html.
// See README.md "Paso 8" for exactly how to get each of these values —
// both services are free.

const WEB3FORMS_ACCESS_KEY = "fb862cfd-f59e-49d3-b15a-fa6bd99673df";
const CALLMEBOT_PHONE = "+61411099730";
const CALLMEBOT_APIKEY = "1042454";

// ── Notifications on new nutrition applications (optional) ──────────────
// Same idea as above, but pinged to Bianca (Head of Nutrition) instead of
// Tomi, every time someone submits the new nutrition application form.
// Leave blank to skip — nutrition applications still get saved to Supabase
// either way. Bianca needs to generate her OWN keys (they're tied to her
// own email/WhatsApp, not Tomi's):
//   1. WEB3FORMS: go to https://web3forms.com, enter her email
//      (Biancadominguezal3@gmail.com), and copy the Access Key it gives
//      her into BIANCA_WEB3FORMS_ACCESS_KEY below.
//   2. GREEN API (replaces CallMeBot, which gets overloaded and stops
//      working once it has too many free users — Tomi's own notification
//      above stays on CallMeBot for now): to keep this one on WhatsApp,
//      her phone has to stay charged and online for notifications to
//      arrive (messages route through her linked phone, like WhatsApp Web).
//      a. Go to https://console.green-api.com, register with her email
//         and a password, confirm the emailed code.
//      b. Click "Create an instance" and choose the free Developer plan.
//      c. Open the instance, click "Get QR", and scan it from her phone:
//         WhatsApp → Settings → Linked Devices → Link a device.
//      d. The instance page shows "idInstance" and "apiTokenInstance" —
//         copy those into BIANCA_GREEN_API_ID_INSTANCE and
//         BIANCA_GREEN_API_TOKEN_INSTANCE below.
//      Her chat ID is already filled in below — Green API sends the
//      message to her own "Message Yourself" chat (WhatsApp's note-to-
//      self), so nothing else needs to change on her phone.
const BIANCA_WEB3FORMS_ACCESS_KEY = "574cdeac-9240-479c-a3e3-e4ed8db5507d";
const BIANCA_GREEN_API_ID_INSTANCE = "";
const BIANCA_GREEN_API_TOKEN_INSTANCE = "";
const BIANCA_GREEN_API_CHAT_ID = "5492617780784@c.us";
