// Logic for account.html — program summary, check-ins, documents and
// progress photos. Requires config.js + supabase-client.js loaded first.

const BUCKET = "client-files";

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

  document.getElementById("btn-signout").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "auth.html";
  });

  loadProgram(user.id);
  loadCheckins(user.id);
  wireCheckinForm(user.id);
  loadDocuments(user.id);
  loadPhotos(user.id);
  wirePhotoUpload(user.id);
});

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
        ? `<a class="btn btn-primary" href="${escapeHtml(data.kahunas_link)}" target="_blank" rel="noopener">Open in Kahunas</a>`
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
  const { data, error } = await supabaseClient
    .from("checkins")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data || !data.length) {
    list.innerHTML = '<p class="muted">No check-ins yet — submit your first one below.</p>';
    return;
  }
  list.innerHTML = data
    .map((c) => {
      const energy = c.energy || 0;
      return `<div class="checkin-row">
        <span class="ci-date">${new Date(c.created_at).toLocaleDateString()}</span>
        <span class="ci-weight">${c.weight != null ? c.weight + " kg" : "—"}</span>
        <span class="ci-energy">${"●".repeat(energy)}${"○".repeat(5 - energy)}</span>
        <span class="ci-notes">${escapeHtml(c.notes || "")}</span>
      </div>`;
    })
    .join("");
}

function wireCheckinForm(uid) {
  const form = document.getElementById("form-checkin");
  const msg = document.getElementById("checkin-msg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const weight = document.getElementById("ci-weight").value;
    const energy = document.getElementById("ci-energy").value;
    const notes = document.getElementById("ci-notes").value.trim();
    const btn = form.querySelector("button");
    btn.disabled = true;
    const { error } = await supabaseClient.from("checkins").insert({
      user_id: uid,
      weight: weight ? parseFloat(weight) : null,
      energy: energy ? parseInt(energy, 10) : null,
      notes: notes || null,
    });
    btn.disabled = false;
    if (error) {
      showMsg(msg, error.message, "error");
      return;
    }
    form.reset();
    showMsg(msg, "Check-in submitted.", "ok");
    loadCheckins(uid);
  });
}

// ---------- Documents (uploaded by the coach) ----------
async function loadDocuments(uid) {
  const box = document.getElementById("documents-list");
  const { data, error } = await supabaseClient.storage
    .from(BUCKET)
    .list(`${uid}/documents`, { limit: 50, sortBy: { column: "created_at", order: "desc" } });

  const files = (data || []).filter((f) => f.name && f.id);
  if (error || !files.length) {
    box.innerHTML = '<p class="muted">Your coach hasn\'t uploaded anything yet.</p>';
    return;
  }
  const rows = await Promise.all(
    files.map(async (f) => {
      const path = `${uid}/documents/${f.name}`;
      const { data: signed } = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, 3600);
      return `<a class="doc-row" href="${signed ? signed.signedUrl : "#"}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/></svg>
        ${escapeHtml(f.name)}
      </a>`;
    })
  );
  box.innerHTML = rows.join("");
}

// ---------- Progress photos (uploaded by the client) ----------
async function loadPhotos(uid) {
  const grid = document.getElementById("photos-grid");
  const { data, error } = await supabaseClient.storage
    .from(BUCKET)
    .list(`${uid}/progress-photos`, { limit: 60, sortBy: { column: "created_at", order: "desc" } });

  const files = (data || []).filter((f) => f.name && f.id);
  if (error || !files.length) {
    grid.innerHTML = '<p class="muted">No photos yet — upload your first one below.</p>';
    return;
  }
  const cells = await Promise.all(
    files.map(async (f) => {
      const path = `${uid}/progress-photos/${f.name}`;
      const { data: signed } = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, 3600);
      return `<div class="photo-cell"><img src="${signed ? signed.signedUrl : ""}" alt="Progress photo" loading="lazy"></div>`;
    })
  );
  grid.innerHTML = cells.join("");
}

function wirePhotoUpload(uid) {
  const input = document.getElementById("photo-input");
  const msg = document.getElementById("photo-msg");
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${uid}/progress-photos/${Date.now()}-${safeName}`;
    msg.textContent = "Uploading…";
    const { error } = await supabaseClient.storage.from(BUCKET).upload(path, file);
    input.value = "";
    if (error) {
      msg.textContent = error.message;
      return;
    }
    msg.textContent = "Photo uploaded.";
    loadPhotos(uid);
  });
}
