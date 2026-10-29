// Logic for the #reviews section on index.html. Requires config.js +
// supabase-client.js loaded first. Pulls only approved reviews (RLS on
// public.reviews already enforces this server-side, but we filter
// explicitly too) and renders the summary row + review cards. The whole
// section stays hidden (see its inline display:none in index.html) until
// at least one approved review comes back — so the section is invisible
// on day one and simply appears once Tomi approves the first review.

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

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.getElementById("reviews");
  const track = document.getElementById("reviews-track");
  if (!section || !track || !supabaseClient) return;

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("name, rating, review_text, created_at")
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
        '<div class="review-stars">' + starsHTML(r.rating) + "</div>" +
        '<p class="review-text">' + escapeHTML(r.review_text) + "</p>" +
        '<div class="review-foot">' +
        '<span class="review-name">' + escapeHTML(r.name) + "</span>" +
        '<span class="review-time">' + timeAgo(r.created_at) + "</span>" +
        "</div>" +
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
