// Handles the "Notify me" email signup for the Shop section. The form lives
// in a small popup (id="shop-notify-modal") that opens when either "Notify
// me" button is clicked — it's not a page section, so it never interferes
// with the wheel-scroll navigation in js/scroll-nav.js. Requires config.js +
// supabase-client.js loaded first. Each email is stored in the
// shop_waitlist table (see sql/shop-waitlist.sql) so Tomi can see how many
// people are interested from the Supabase Table Editor — nobody can read
// this list from the website itself.

function showShopNotifyError(el, text) {
  el.textContent = text;
  el.className = "auth-msg show error";
}

// Best-effort ping to the coach's own WhatsApp + email, same pattern as the
// other forms on the site — never blocks or fails the signup itself.
function notifyShopWaitlistSignup(email) {
  const summary = "New Shop waitlist signup on thebuildsystem.club\nEmail: " + email;

  if (typeof WEB3FORMS_ACCESS_KEY !== "undefined" && WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New Shop waitlist signup",
        from_name: "thebuildsystem website",
        message: summary,
      }),
    }).catch(() => {});
  }

  if (
    typeof CALLMEBOT_PHONE !== "undefined" && CALLMEBOT_PHONE &&
    typeof CALLMEBOT_APIKEY !== "undefined" && CALLMEBOT_APIKEY
  ) {
    const url =
      "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(CALLMEBOT_PHONE) +
      "&text=" + encodeURIComponent(summary) +
      "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY);
    new Image().src = url;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-shop-notify");
  if (!form) return;

  const successBox = document.getElementById("shop-notify-success");
  const errorMsg = document.getElementById("shop-notify-error");
  const modal = document.getElementById("shop-notify-modal");

  // ---------- Popup open/close ----------
  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("shop-notify-modal-lock");
    const emailInput = document.getElementById("shop-notify-email");
    if (emailInput) setTimeout(() => emailInput.focus(), 50);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("shop-notify-modal-lock");
  }

  document.querySelectorAll(".js-shop-notify-open").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });
  if (modal) {
    modal.querySelectorAll("[data-shop-notify-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    // Honeypot: hidden field real visitors never see or fill.
    const honeypot = document.getElementById("shop-notify-website");
    if (honeypot && honeypot.value.trim() !== "") {
      form.style.display = "none";
      successBox.style.display = "block";
      return;
    }

    const email = document.getElementById("shop-notify-email").value.trim();
    if (!email) {
      showShopNotifyError(errorMsg, "Enter your email first.");
      return;
    }

    if (!supabaseClient) {
      showShopNotifyError(errorMsg, "Something went wrong — please try again in a moment.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { error } = await supabaseClient.from("shop_waitlist").insert({ email: email });

    btn.disabled = false;

    // A duplicate email (already on the list) should still feel like success
    // from the visitor's side — only a real failure shows the error state.
    if (error && error.code !== "23505") {
      showShopNotifyError(errorMsg, "Something went wrong — please try again.");
      return;
    }

    notifyShopWaitlistSignup(email);

    form.style.display = "none";
    successBox.style.display = "block";
  });
});
