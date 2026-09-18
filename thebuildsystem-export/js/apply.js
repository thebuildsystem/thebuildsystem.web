// Logic for apply.html — the public 1:1 Coaching Application form.
// Requires config.js + supabase-client.js loaded first. No login required —
// anyone can submit; submissions are only readable from the Supabase dashboard.

function showApplyError(el, text) {
  el.textContent = text;
  el.className = "auth-msg show error";
}

// Best-effort ping to the coach's own WhatsApp + email — never blocks or
// fails the form submission. Both are skipped silently if left unconfigured
// in js/config.js.
function notifyNewApplication(data) {
  const summary =
    "New 1:1 coaching application\n" +
    "Name: " + data.firstName + "\n" +
    "Email: " + data.email + "\n" +
    "Phone: " + data.phone + "\n" +
    "Timeline: " + data.timeline + "\n" +
    "Goals: " + data.goals;

  if (typeof WEB3FORMS_ACCESS_KEY !== "undefined" && WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New 1:1 application — " + data.firstName,
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
    new Image().src = url; // fire-and-forget GET, sidesteps CORS on the response
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-apply");
  const successBox = document.getElementById("apply-success");
  const errorMsg = document.getElementById("apply-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    const firstName = document.getElementById("ap-firstname").value.trim();
    const email = document.getElementById("ap-email").value.trim();
    const phone = document.getElementById("ap-phone").value.trim();
    const birthday = document.getElementById("ap-birthday").value;
    const timelineEl = form.querySelector('input[name="timeline"]:checked');
    const goals = Array.from(form.querySelectorAll('input[name="goal"]:checked')).map((el) => el.value);

    if (!firstName || !email || !phone || !timelineEl || goals.length === 0) {
      showApplyError(errorMsg, "Please fill in all fields before submitting.");
      return;
    }

    if (!supabaseClient) {
      showApplyError(errorMsg, "Something went wrong — please try again in a moment.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { error } = await supabaseClient.from("applications").insert({
      first_name: firstName,
      email: email,
      phone: phone,
      birthday: birthday || null,
      timeline: timelineEl.value,
      goals: goals.join(", "),
    });

    btn.disabled = false;

    if (error) {
      showApplyError(errorMsg, "Something went wrong — please try again.");
      return;
    }

    notifyNewApplication({
      firstName: firstName,
      email: email,
      phone: phone,
      timeline: timelineEl.value,
      goals: goals.join(", "),
    });

    form.style.display = "none";
    successBox.style.display = "block";
  });
});
