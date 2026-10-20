// Logic for the #nutrition-apply section on index.html — the public
// nutrition application form. Requires config.js + supabase-client.js
// loaded first. No login required — anyone can submit; submissions are
// only readable from the Supabase dashboard.

function showNutritionApplyError(el, text) {
  el.textContent = text;
  el.className = "auth-msg show error";
}

// Best-effort ping to Bianca's own WhatsApp + email — never blocks or
// fails the form submission. Both are skipped silently if left unconfigured
// in js/config.js (she needs to generate her own keys — see the comments
// there).
function notifyNewNutritionApplication(data) {
  const summary =
    "New nutrition application\n" +
    "Name: " + data.name + "\n" +
    "Email: " + data.email + "\n" +
    "Phone: " + data.phone + "\n" +
    "Sport: " + data.sport + "\n" +
    "Timeline: " + data.timeline;

  if (typeof BIANCA_WEB3FORMS_ACCESS_KEY !== "undefined" && BIANCA_WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: BIANCA_WEB3FORMS_ACCESS_KEY,
        subject: "New nutrition application — " + data.name,
        from_name: "thebuildsystem website",
        message: summary,
      }),
    }).catch(() => {});
  }

  if (
    typeof BIANCA_GREEN_API_ID_INSTANCE !== "undefined" && BIANCA_GREEN_API_ID_INSTANCE &&
    typeof BIANCA_GREEN_API_TOKEN_INSTANCE !== "undefined" && BIANCA_GREEN_API_TOKEN_INSTANCE &&
    typeof BIANCA_GREEN_API_CHAT_ID !== "undefined" && BIANCA_GREEN_API_CHAT_ID
  ) {
    // Green API needs a POST with a JSON body (unlike CallMeBot's plain GET),
    // so this can't use the new Image() trick — a real fetch it is. Still
    // fire-and-forget: a failure here never blocks the form.
    fetch(
      "https://api.green-api.com/waInstance" + BIANCA_GREEN_API_ID_INSTANCE +
      "/sendMessage/" + BIANCA_GREEN_API_TOKEN_INSTANCE,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: BIANCA_GREEN_API_CHAT_ID,
          message: summary,
        }),
      }
    ).catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-nutrition-apply");
  if (!form) return; // section not on this page

  const successBox = document.getElementById("nutrition-apply-success");
  const errorMsg = document.getElementById("nutrition-apply-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    // Honeypot: a field hidden off-screen that real visitors never see or fill.
    const honeypot = document.getElementById("nu-website");
    if (honeypot && honeypot.value.trim() !== "") {
      form.style.display = "none";
      successBox.style.display = "block";
      return;
    }

    const name = document.getElementById("nu-name").value.trim();
    const email = document.getElementById("nu-email").value.trim();
    const phone = document.getElementById("nu-phone").value.trim();
    const sportEl = form.querySelector('input[name="sport"]:checked');
    const timelineEl = form.querySelector('input[name="timeline"]:checked');

    if (!name || !email || !phone || !sportEl || !timelineEl) {
      showNutritionApplyError(errorMsg, "Please fill in all fields before submitting.");
      return;
    }

    if (!supabaseClient) {
      showNutritionApplyError(errorMsg, "Something went wrong — please try again in a moment.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { error } = await supabaseClient.from("nutrition_applications").insert({
      name: name,
      email: email,
      phone: phone,
      sport: sportEl.value,
      timeline: timelineEl.value,
    });

    btn.disabled = false;

    if (error) {
      showNutritionApplyError(errorMsg, "Something went wrong — please try again.");
      return;
    }

    notifyNewNutritionApplication({
      name: name,
      email: email,
      phone: phone,
      sport: sportEl.value,
      timeline: timelineEl.value,
    });

    form.style.display = "none";
    successBox.style.display = "block";
  });
});
