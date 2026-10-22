// Shared country-code list for phone fields across apply.html / index.html
// (#apply and #nutrition-apply sections). Populates a <select class="phone-country">
// with a flag + country name + dial code, so Tomi/Bianca can always tell which
// country a client's number belongs to instead of guessing from a raw digit string.
//
// Argentina is first and selected by default since most applicants are local;
// the rest are sorted alphabetically by country name. Add more entries here if a
// client's country is missing — every phone field on the site reads this same list.
const PHONE_COUNTRIES = [
  { iso: "AR", flag: "🇦🇷", name: "Argentina", code: "+54" },
  { iso: "AU", flag: "🇦🇺", name: "Australia", code: "+61" },
  { iso: "BE", flag: "🇧🇪", name: "Belgium", code: "+32" },
  { iso: "BO", flag: "🇧🇴", name: "Bolivia", code: "+591" },
  { iso: "BR", flag: "🇧🇷", name: "Brazil", code: "+55" },
  { iso: "CA", flag: "🇨🇦", name: "Canada", code: "+1" },
  { iso: "CL", flag: "🇨🇱", name: "Chile", code: "+56" },
  { iso: "CO", flag: "🇨🇴", name: "Colombia", code: "+57" },
  { iso: "CR", flag: "🇨🇷", name: "Costa Rica", code: "+506" },
  { iso: "DK", flag: "🇩🇰", name: "Denmark", code: "+45" },
  { iso: "EC", flag: "🇪🇨", name: "Ecuador", code: "+593" },
  { iso: "FI", flag: "🇫🇮", name: "Finland", code: "+358" },
  { iso: "FR", flag: "🇫🇷", name: "France", code: "+33" },
  { iso: "DE", flag: "🇩🇪", name: "Germany", code: "+49" },
  { iso: "IE", flag: "🇮🇪", name: "Ireland", code: "+353" },
  { iso: "IL", flag: "🇮🇱", name: "Israel", code: "+972" },
  { iso: "IT", flag: "🇮🇹", name: "Italy", code: "+39" },
  { iso: "MX", flag: "🇲🇽", name: "Mexico", code: "+52" },
  { iso: "NL", flag: "🇳🇱", name: "Netherlands", code: "+31" },
  { iso: "NZ", flag: "🇳🇿", name: "New Zealand", code: "+64" },
  { iso: "NO", flag: "🇳🇴", name: "Norway", code: "+47" },
  { iso: "PY", flag: "🇵🇾", name: "Paraguay", code: "+595" },
  { iso: "PE", flag: "🇵🇪", name: "Peru", code: "+51" },
  { iso: "PT", flag: "🇵🇹", name: "Portugal", code: "+351" },
  { iso: "ES", flag: "🇪🇸", name: "Spain", code: "+34" },
  { iso: "SE", flag: "🇸🇪", name: "Sweden", code: "+46" },
  { iso: "CH", flag: "🇨🇭", name: "Switzerland", code: "+41" },
  { iso: "GB", flag: "🇬🇧", name: "United Kingdom", code: "+44" },
  { iso: "US", flag: "🇺🇸", name: "United States", code: "+1" },
  { iso: "UY", flag: "🇺🇾", name: "Uruguay", code: "+598" },
  { iso: "VE", flag: "🇻🇪", name: "Venezuela", code: "+58" },
];

// Fills a <select> with every country above. Pass the <select> element
// (class="phone-country") found next to a phone <input>. Argentina is selected
// by default unless the select already has a non-empty value (e.g. on reload).
function populatePhoneCountrySelect(selectEl) {
  if (!selectEl || selectEl.dataset.populated === "1") return;
  selectEl.innerHTML = "";
  PHONE_COUNTRIES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = c.flag + " " + c.name + " (" + c.code + ")";
    opt.dataset.iso = c.iso;
    selectEl.appendChild(opt);
  });
  selectEl.value = "+54"; // Argentina default
  selectEl.dataset.populated = "1";
}

// Combines a country <select> + number <input> into one E.164-ish string for
// storage/notifications, e.g. "+54 9 11 1234 5678". Trims so an empty number
// input yields "" rather than just the dial code.
function getFullPhoneValue(selectEl, inputEl) {
  const code = selectEl ? selectEl.value.trim() : "";
  const number = inputEl ? inputEl.value.trim() : "";
  if (!number) return "";
  return code ? code + " " + number : number;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("select.phone-country").forEach(populatePhoneCountrySelect);
});
