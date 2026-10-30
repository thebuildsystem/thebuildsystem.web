// Logic for arrepentimiento.html — the "botón de arrepentimiento" revocation
// request form required by Resolución 424/2020. Requires config.js +
// supabase-client.js loaded first. No login required — anyone can submit.
//
// Resolución 424/2020 requires the consumer to get an identification code
// for their request within 24 hours, through the same channel they used.
// We generate that code right here in the browser and show it immediately
// (well inside the 24-hour window), and also store it on the row in
// Supabase so Tomi can look a request up later from just the code.

function showArrepentimientoError(el, text) {
  el.textContent = text;
  el.className = "auth-msg show error";
}

function generateConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "ARR-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += "-";
  }
  return code;
}

// Best-effort ping to the coach's own WhatsApp + email — never blocks or
// fails the form submission. Both are skipped silently if left unconfigured
// in js/config.js.
function notifyNewRevocationRequest(data) {
  const summary =
    "Nueva solicitud de arrepentimiento (botón de arrepentimiento)\n" +
    "Código: " + data.code + "\n" +
    "Nombre: " + data.name + "\n" +
    "Email: " + data.email + "\n" +
    "Teléfono: " + (data.phone || "-") + "\n" +
    "Compra/contratación: " + (data.orderRef || "-") + "\n" +
    "Motivo: " + (data.reason || "-");

  if (typeof WEB3FORMS_ACCESS_KEY !== "undefined" && WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Botón de arrepentimiento — " + data.name,
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
  const form = document.getElementById("form-arrepentimiento");
  const successBox = document.getElementById("arrepentimiento-success");
  const codeEl = document.getElementById("arrepentimiento-code");
  const errorMsg = document.getElementById("arrepentimiento-error");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.className = "auth-msg";

    const name = document.getElementById("ar-name").value.trim();
    const email = document.getElementById("ar-email").value.trim();
    const phone = document.getElementById("ar-phone").value.trim();
    const orderRef = document.getElementById("ar-order").value.trim();
    const reason = document.getElementById("ar-reason").value.trim();
    const honeypot = document.getElementById("ar-website").value;

    if (honeypot) return; // bot — silently drop

    if (!name || !email) {
      showArrepentimientoError(errorMsg, "Completá al menos tu nombre y email antes de enviar.");
      return;
    }

    if (!supabaseClient) {
      showArrepentimientoError(errorMsg, "Algo salió mal — probá de nuevo en un momento.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const code = generateConfirmationCode();

    const { error } = await supabaseClient.from("revocation_requests").insert({
      confirmation_code: code,
      full_name: name,
      email: email,
      phone: phone || null,
      order_reference: orderRef || null,
      reason: reason || null,
    });

    btn.disabled = false;

    if (error) {
      showArrepentimientoError(errorMsg, "Algo salió mal — probá de nuevo.");
      return;
    }

    notifyNewRevocationRequest({ code: code, name: name, email: email, phone: phone, orderRef: orderRef, reason: reason });

    form.style.display = "none";
    codeEl.textContent = code;
    successBox.style.display = "block";
  });
});
