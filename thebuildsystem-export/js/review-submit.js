// Logic for review.html — the unlisted, link-only review submission page.
// Requires config.js + supabase-client.js loaded first. Anyone with the
// direct link can submit, but the insert is forced to approved=false by
// the RLS policy on public.reviews, so nothing shows on the site until
// Tomi approves it from the Supabase dashboard.

function showReviewError(el, text) {
  el.textContent = text;
  el.className = "auth-msg show error";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-review");
  if (!form) return; // not on this page

  const successBox = document.getElementById("review-success");
  const errorMsg = document.getElementById("review-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    // Honeypot: a field hidden off-screen that real visitors never see or fill.
    const honeypot = document.getElementById("rv-website");
    if (honeypot && honeypot.value.trim() !== "") {
      form.style.display = "none";
      successBox.style.display = "block";
      return;
    }

    const name = document.getElementById("rv-name").value.trim();
    const ratingEl = form.querySelector('input[name="rv-rating"]:checked');
    const text = document.getElementById("rv-text").value.trim();

    if (!name || !ratingEl || !text) {
      const lang = (() => { try { return localStorage.getItem("tbs-lang"); } catch (e) { return null; } })();
      showReviewError(
        errorMsg,
        lang === "es"
          ? "Completá tu nombre, un puntaje y tu reseña antes de enviar."
          : "Please fill in your name, a rating, and your review before submitting."
      );
      return;
    }

    if (!supabaseClient) {
      showReviewError(errorMsg, "Something went wrong — please try again in a moment.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { error } = await supabaseClient.from("reviews").insert({
      name: name,
      rating: parseInt(ratingEl.value, 10),
      review_text: text,
      approved: false,
    });

    btn.disabled = false;

    if (error) {
      showReviewError(errorMsg, "Something went wrong — please try again.");
      return;
    }

    form.style.display = "none";
    successBox.style.display = "block";
  });
});
