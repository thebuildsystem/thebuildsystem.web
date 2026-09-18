// Swaps the "Client Login" nav button for the signed-in person's first name.
// Safe to include on any public page that has a .login-link in its header —
// does nothing if nobody is signed in, or if supabaseClient isn't ready.

document.addEventListener("DOMContentLoaded", async () => {
  const link = document.querySelector(".login-link");
  if (!link || typeof supabaseClient === "undefined" || !supabaseClient) return;

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;

  const user = data.session.user;
  const fullName = (user.user_metadata && user.user_metadata.full_name) || "";
  const firstName = fullName.trim().split(/\s+/)[0] || (user.email || "").split("@")[0];

  const textEl = link.querySelector(".login-text");
  if (textEl) textEl.textContent = firstName;
  link.setAttribute("href", "account.html");
  link.setAttribute("title", "My account");
  link.setAttribute("aria-label", "My account");
});
