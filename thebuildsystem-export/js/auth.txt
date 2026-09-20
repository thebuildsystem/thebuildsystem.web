// Sign up / sign in logic for auth.html.
// Requires supabase-client.js (and config.js before it) to already be
// loaded on the page.

function showMessage(el, text, kind) {
  el.textContent = text;
  el.className = "auth-msg show " + (kind || "");
}

function hideMessage(el) {
  el.className = "auth-msg";
}

// Best-effort ping to the coach's own WhatsApp + email when someone creates
// a new client account — never blocks or fails the sign-up. Skipped silently
// if WEB3FORMS_ACCESS_KEY / CALLMEBOT_PHONE / CALLMEBOT_APIKEY are left
// unconfigured in js/config.js. Same pattern as js/apply.js and
// js/camp-contact.js.
function notifyNewSignup(data) {
  var summary =
    "New client account on thebuildsystem.club\n" +
    "Name: " + (data.name || "(no name given)") + "\n" +
    "Email: " + data.email;

  if (typeof WEB3FORMS_ACCESS_KEY !== "undefined" && WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New client account — " + (data.name || data.email),
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
    new Image().src = url; // fire-and-forget GET, sidesteps CORS on the response
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabSignIn = document.getElementById("tab-signin");
  const tabSignUp = document.getElementById("tab-signup");
  const panelSignIn = document.getElementById("panel-signin");
  const panelSignUp = document.getElementById("panel-signup");
  const msg = document.getElementById("auth-msg");

  function setActive(which) {
    hideMessage(msg);
    const signIn = which === "signin";
    tabSignIn.classList.toggle("active", signIn);
    tabSignUp.classList.toggle("active", !signIn);
    panelSignIn.classList.toggle("active", signIn);
    panelSignUp.classList.toggle("active", !signIn);
  }
  tabSignIn.addEventListener("click", () => setActive("signin"));
  tabSignUp.addEventListener("click", () => setActive("signup"));

  if (!supabaseClient) {
    showMessage(
      msg,
      "Supabase isn't configured yet — edit js/config.js with your project's URL and anon key.",
      "error"
    );
    return;
  }

  // If already signed in, skip straight to the account page.
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) window.location.href = "account.html";
  });

  const signInForm = document.getElementById("form-signin");
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessage(msg);
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;
    const btn = signInForm.querySelector("button");
    btn.disabled = true;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    if (error) {
      showMessage(msg, error.message, "error");
      return;
    }
    window.location.href = "account.html";
  });

  const signUpForm = document.getElementById("form-signup");
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessage(msg);
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const btn = signUpForm.querySelector("button");
    btn.disabled = true;
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    btn.disabled = false;
    if (error) {
      showMessage(msg, error.message, "error");
      return;
    }

    notifyNewSignup({ name: name, email: email });

    if (data.session) {
      window.location.href = "account.html";
    } else {
      showMessage(
        msg,
        "Account created — check your email to confirm before signing in.",
        "ok"
      );
    }
  });
});
