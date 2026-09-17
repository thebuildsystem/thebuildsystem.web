// Loads the Supabase JS client (via CDN, see <script> tags in the HTML
// pages) and creates one shared client instance every page can import.
//
// This file assumes config.js has already been loaded on the page and
// defines SUPABASE_URL / SUPABASE_ANON_KEY.

const supabaseClient = (() => {
  if (typeof window.supabase === "undefined") {
    console.error(
      "Supabase JS library not found. Make sure the CDN <script> tag loads " +
      "before supabase-client.js on every page."
    );
    return null;
  }
  if (
    !SUPABASE_URL ||
    SUPABASE_URL.includes("YOUR-PROJECT-REF") ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes("YOUR-ANON")
  ) {
    console.warn(
      "Supabase is not configured yet — edit js/config.js with your " +
      "project's URL and anon key."
    );
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
