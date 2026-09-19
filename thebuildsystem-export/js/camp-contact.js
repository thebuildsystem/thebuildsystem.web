// Contact box in the CAMP section. Reuses the exact same Web3Forms +
// CallMeBot notification path already wired up in js/apply.js / js/config.js
// (WEB3FORMS_ACCESS_KEY, CALLMEBOT_PHONE, CALLMEBOT_APIKEY) — nothing new to
// configure. No Supabase table: this is a lightweight "get in touch" box,
// not a tracked application, so the message just goes straight to the
// coach's email/WhatsApp.
(function () {
  var form = document.getElementById("form-camp-contact");
  if (!form) return;

  var errorMsg = document.getElementById("camp-contact-error");
  var successBox = document.getElementById("camp-contact-success");

  function notifyCampInquiry(data) {
    var summary =
      "New Camp inquiry from thebuildsystem.club\n" +
      "Name: " + data.name + "\n" +
      "Email: " + data.email + "\n" +
      "Message: " + data.message;

    if (typeof WEB3FORMS_ACCESS_KEY !== "undefined" && WEB3FORMS_ACCESS_KEY) {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New Camp inquiry — " + (data.name || "no name"),
          from_name: "thebuildsystem website",
          message: summary,
        }),
      }).catch(function () {});
    }

    if (
      typeof CALLMEBOT_PHONE !== "undefined" && CALLMEBOT_PHONE &&
      typeof CALLMEBOT_APIKEY !== "undefined" && CALLMEBOT_APIKEY
    ) {
      var url =
        "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(CALLMEBOT_PHONE) +
        "&text=" + encodeURIComponent(summary) +
        "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY);
      new Image().src = url; // fire-and-forget, same pattern as apply.js
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    // Honeypot: hidden field real visitors never see or fill.
    var honeypot = document.getElementById("camp-website");
    if (honeypot && honeypot.value.trim() !== "") {
      form.style.display = "none";
      successBox.style.display = "block";
      return;
    }

    var name = document.getElementById("camp-name").value.trim();
    var email = document.getElementById("camp-email").value.trim();
    var message = document.getElementById("camp-message").value.trim();

    if (!name || !email || !message) {
      errorMsg.textContent = "Please fill in all fields before sending.";
      errorMsg.className = "auth-msg show error";
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    notifyCampInquiry({ name: name, email: email, message: message });

    btn.disabled = false;
    form.style.display = "none";
    successBox.style.display = "block";
  });
})();
