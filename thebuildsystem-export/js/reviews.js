// Logic for the #reviews section on index.html. Requires config.js +
// supabase-client.js loaded first. Pulls only approved reviews (RLS on
// public.reviews already enforces this server-side, but we filter
// explicitly too) and renders the summary row + review cards. The whole
// section stays hidden (see its inline display:none in index.html) until
// at least one approved review comes back — so the section is invisible
// on day one and simply appears once Tomi approves the first review.
//
// `location` and `photo_url` are two extra, optional text columns on
// public.reviews that review.html's submission form never fills in —
// they only get set when Tomi edits a row by hand in the Supabase table
// editor. Both columns must exist (even if empty) or this file's select()
// call errors out and the whole section stays hidden, so add them before
// the first review goes live:
//   - location  (text, nullable) — e.g. "Buenos Aires, Argentina"
//   - photo_url (text, nullable) — a public image URL (Supabase Storage,
//     or anywhere else reachable); leave it blank to keep the initials
//     avatar for that review.

function timeAgo(dateStr) {
  const lang = (() => { try { return localStorage.getItem("tbs-lang"); } catch (e) { return null; } })();
  const es = lang === "es";
  const seconds = Math.max(0, (Date.now() - new Date(dateStr).getTime()) / 1000);
  const units = [
    [31536000, es ? "año" : "year"],
    [2592000, es ? "mes" : "month"],
    [604800, es ? "semana" : "week"],
    [86400, es ? "día" : "day"],
  ];
  for (const [secs, label] of units) {
    const n = Math.floor(seconds / secs);
    if (n >= 1) {
      const plural = es ? (label === "mes" ? "es" : "s") : "s";
      return es
        ? "hace " + n + " " + label + (n > 1 ? plural : "")
        : n + " " + label + (n > 1 ? "s" : "") + " ago";
    }
  }
  return es ? "hace poco" : "recently";
}

function starsHTML(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? "★" : "☆";
  }
  return html;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0].toUpperCase()).join("") || "?";
}

// A review's location and photo are both optional — most reviews coming
// in through review.html won't have either, and that's fine: the pin/dot
// and the avatar photo only show up once Tomi fills them in by hand from
// the Supabase table editor (see js/reviews.js header comment / the
// `location` and `photo_url` columns on public.reviews).
const LOCATION_PIN_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.5 7-12a7 7 0 0 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>';

function avatarHTML(r) {
  if (r.photo_url) {
    return '<img src="' + escapeHTML(r.photo_url) + '" alt="" loading="lazy">';
  }
  return initials(r.name);
}

function metaHTML(r) {
  const location = r.location
    ? '<span class="review-location">' + LOCATION_PIN_SVG + escapeHTML(r.location) + "</span>"
    : "";
  const dot = r.location ? '<span class="review-meta-dot">&middot;</span>' : "";
  return location + dot + timeAgo(r.created_at);
}

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.getElementById("reviews");
  const track = document.getElementById("reviews-track");
  if (!section || !track || !supabaseClient) return;

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("name, rating, review_text, created_at, location, photo_url")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data || data.length === 0) return; // stays hidden

  const total = data.length;
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / total;

  const lang = (() => { try { return localStorage.getItem("tbs-lang"); } catch (e) { return null; } })();
  const countLabel =
    lang === "es"
      ? "Basado en " + total + (total === 1 ? " reseña" : " reseñas")
      : "Based on " + total + (total === 1 ? " review" : " reviews");

  document.getElementById("reviews-score").textContent = avg.toFixed(1);
  document.getElementById("reviews-stars").textContent = starsHTML(Math.round(avg));
  document.getElementById("reviews-count").textContent = countLabel;

  track.innerHTML = data
    .map(
      (r) =>
        '<div class="review-card">' +
        '<div class="review-avatar">' + avatarHTML(r) + "</div>" +
        '<p class="review-name">' + escapeHTML(r.name) + "</p>" +
        '<p class="review-meta">' + metaHTML(r) + "</p>" +
        '<p class="review-text">' + escapeHTML(r.review_text) + "</p>" +
        '<div class="review-stars">' + starsHTML(r.rating) + "</div>" +
        "</div>"
    )
    .join("");

  section.style.display = "";

  const prevBtn = section.querySelector(".reviews-arrow-prev");
  const nextBtn = section.querySelector(".reviews-arrow-next");
  function scrollByCard(dir) {
    const card = track.querySelector(".review-card");
    const step = card ? card.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }
  if (prevBtn) prevBtn.addEventListener("click", () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollByCard(1));
});
