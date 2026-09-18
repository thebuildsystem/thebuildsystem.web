// Logic for account.html — program summary, check-ins, documents,
// progress photos and profile photo. Requires config.js + supabase-client.js loaded first.

const BUCKET = "client-files";
const AVATAR_FOLDER = "avatar";
const PHOTO_SLOTS = [
  { key: "day1", label: "Day 1" },
  { key: "month1", label: "Month 1" },
  { key: "month2", label: "Month 2" },
  { key: "month3", label: "Month 3" },
  { key: "month4", label: "Month 4" },
  { key: "month5", label: "Month 5" },
  { key: "month6", label: "Month 6" },
  { key: "month7", label: "Month 7" },
  { key: "month8", label: "Month 8" },
  { key: "month9", label: "Month 9" },
  { key: "month10", label: "Month 10" },
  { key: "month11", label: "Month 11" },
  { key: "month12", label: "Month 12" },
];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function showMsg(el, text, kind) {
  el.textContent = text;
  el.className = "auth-msg show " + (kind || "");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) return;

  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "auth.html";
    return;
  }
  const user = sessionData.session.user;
  document.getElementById("account-email").textContent = user.email;

  const fullName = (user.user_metadata && user.user_metadata.full_name) || "";
  const firstName = fullName.trim().split(/\s+/)[0];
  document.getElementById("account-name").textContent = firstName
    ? "Welcome back, " + firstName
    : "Welcome back";

  document.getElementById("btn-signout").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "auth.html";
  });

  loadAvatar(user.id);
  wireAvatarUpload(user.id);
  loadProgram(user.id);
  loadCheckins(user.id);
  wireCheckinForm(user.id);
  loadDocuments(user.id);
  loadPhotos(user.id);
});

// ---------- Profile photo ----------
async function loadAvatar(uid) {
  const img = document.getElementById("avatar-img");
  const placeholder = document.getElementById("avatar-placeholder");
  const { data, error } = await supabaseClient.storage
    .from(BUCKET)
    .list(`${uid}/${AVATAR_FOLDER}`, { limit: 5, sortBy: { column: "created_at", order: "desc" } });

  const files = (data || []).filter((f) => f.name && f.id);
  if (error || !files.length) {
    img.style.display = "none";
    placeholder.style.display = "flex";
    return;
  }
  const path = `${uid}/${AVATAR_FOLDER}/${files[0].name}`;
  const { data: signed } = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (signed) {
    img.src = signed.signedUrl;
    img.style.display = "block";
    placeholder.style.display = "none";
  }
}

function wireAvatarUpload(uid) {
  const input = document.getElementById("avatar-input");
  const msg = document.getElementById("avatar-msg");
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    msg.textContent = "Uploading…";

    const { data: existing } = await supabaseClient.storage
      .from(BUCKET)
      .list(`${uid}/${AVATAR_FOLDER}`, { limit: 10 });
    const oldPaths = (existing || [])
      .filter((f) => f.name && f.id)
      .map((f) => `${uid}/${AVATAR_FOLDER}/${f.name}`);
    if (oldPaths.length) {
      await supabaseClient.storage.from(BUCKET).remove(oldPaths);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${uid}/${AVATAR_FOLDER}/${Date.now()}-${safeName}`;
    const { error } = await supabaseClient.storage.from(BUCKET).upload(path, file);
    input.value = "";
    if (error) {
      msg.textContent = error.message;
      return;
    }
    msg.textContent = "Photo updated.";
    loadAvatar(uid);
  });
}

// ---------- Program + next check-in ----------
async function loadProgram(uid) {
  const programBox = document.getElementById("program-box");
  const nextBox = document.getElementById("next-checkin-box");
  const { data, error } = await supabaseClient
    .from("client_programs")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();

  if (error || !data || (!data.program_name && !data.program_note && !data.kahunas_link)) {
    programBox.innerHTML = '<p class="muted">Your coach hasn\'t assigned a program yet.</p>';
  } else {
    programBox.innerHTML =
      (data.program_name ? `<p class="program-name">${escapeHtml(data.program_name)}</p>` : "") +
      (data.program_note ? `<p class="program-note">${escapeHtml(data.program_note)}</p>` : "") +
      (data.kahunas_link
        ? `<a class="btn btn-kahunas" href="${escapeHtml(data.kahunas_link)}" target="_blank" rel="noopener">
            <span class="kahunas-logo-wrap"><img src="https://files.kahunas.io/assets/kahunas_home/imgs/logo.svg" alt=""></span>
            Open Kahunas
          </a>`
        : "");
  }

  if (data && data.next_checkin_date) {
    const d = new Date(data.next_checkin_date + "T00:00:00");
    nextBox.innerHTML = `<p>${d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>`;
  } else {
    nextBox.innerHTML = '<p class="muted">No check-in scheduled yet.</p>';
  }
}

// ---------- Check-ins ----------
async function loadCheckins(uid) {
  const list = document.getElementById("checkin-list");
  const statBox = document.getElementById("checkin-stat");
  const { data, error } = await supabaseClient
    .from("checkins")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data || !data.length) {
    list.innerHTML = '<p class="muted">No check-ins yet — submit your first one below.</p>';
    if (statBox) statBox.style.display = "none";
    return;
  }

  if (statBox) {
    const latest = data[0];
    const prev = data.find((c, i) => i > 0 && c.weight != null);
    if (latest.weight != null) {
      let deltaHtml = "";
      if (prev) {
        const delta = Math.round((latest.weight - prev.weight) * 10) / 10;
        const sign = delta > 0 ? "+" : "";
        const cls = delta < 0
