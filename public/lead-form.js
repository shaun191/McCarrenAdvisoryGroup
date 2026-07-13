/* McCarren Advisory — landing-page lead form handler.
   Mirrors the ResourcePopup pipeline: POSTs the lead to the Power Automate
   HTTP flow (→ Dynamics 365 "Leads" + "New Lead Email Alert"), fires the
   Google Ads lead conversion, downloads the matching guide (if any), then
   swaps the form for a success state with the booking link.

   Per-form config comes from data-* attributes on <form class="lead">:
     data-lead-source   e.g. "lp-succession-assessment"  (also sent as source/topic)
     data-topic-label   e.g. "Landing page: Succession Readiness Assessment"
     data-guide         guide name shown to the user + written to the CRM Description
     data-guide-file    path to the PDF to download; leave empty for call-only pages
*/
(function () {
  var LEAD_ENDPOINT = "https://e5c9aacced60e92380989bbfbbd379.0e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/42973334ea7b44bbb7f0a8a2ed217327/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OTcK0rBA4DF1hq0F65TunIJoAlXe_hWF2SPYMs9MYDw";
  var LEAD_CONVERSION_SEND_TO = "AW-18291211119/yFfxCO2ShckcEO_29pFE";
  var BOOKING_URL = "https://outlook.office.com/book/McCarrenAdvisoryGroup@flow-eze.com/?ismsaljsauthenabled";

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()); }
  function val(form, n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; }

  function download(file) {
    if (!file) return;
    var a = document.createElement("a");
    a.href = file; a.download = file.split("/").pop();
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function attach(form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var err = document.createElement("p");
    err.className = "lead-error";
    err.setAttribute("role", "alert");
    if (submitBtn) form.insertBefore(err, submitBtn);

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      err.textContent = "";
      var name = val(form, "name"), email = val(form, "email"),
          company = val(form, "company"), phone = val(form, "phone");
      var sel = form.querySelector("select");
      var selVal = sel ? sel.value : "";
      if (!name) { err.textContent = "Please enter your name."; return; }
      if (!validEmail(email)) { err.textContent = "Please enter a valid email address."; return; }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      var guide = form.getAttribute("data-guide") || "";
      var guideFile = form.getAttribute("data-guide-file") || "";
      var topicLabel = form.getAttribute("data-topic-label") || document.title;
      var source = form.getAttribute("data-lead-source") || "landing-page";

      var payload = {
        name: name, email: email, company: company, phone: phone,
        topic: source, topicLabel: topicLabel,
        guide: guide + (selVal ? (" — " + selVal) : ""),
        source: source,
        pageUrl: (typeof window !== "undefined") ? window.location.href : "",
        submittedAt: new Date().toISOString()
      };

      // Best-effort send to Dynamics via Power Automate; never block UX on a hiccup.
      if (LEAD_ENDPOINT) {
        try {
          await fetch(LEAD_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } catch (e2) { /* swallow */ }
      }

      // Analytics: GA4 lead event + Google Ads lead conversion (needs gtag on page).
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", { lead_topic: topicLabel, value: 1 });
        if (LEAD_CONVERSION_SEND_TO) {
          window.gtag("event", "conversion", { send_to: LEAD_CONVERSION_SEND_TO });
        }
      }

      download(guideFile);

      var done = document.createElement("div");
      done.className = "lead-done";
      var heading = guideFile ? "Your guide is downloading." : "Thanks — you’re on the list.";
      var msg = guideFile
        ? "Check your downloads for <strong>" + guide + "</strong>. Prefer to talk it through?"
        : "We’ve got your details and will be in touch. Want to grab a time now?";
      done.innerHTML =
        '<div class="lead-done-check" aria-hidden="true">✓</div>' +
        "<h3>" + heading + "</h3>" +
        "<p>" + msg + "</p>" +
        '<a class="btn btn-primary" href="' + BOOKING_URL + '" target="_blank" rel="noopener noreferrer">Schedule a 30-Minute Call</a>';
      form.parentNode.replaceChild(done, form);
    });
  }

  var css = document.createElement("style");
  css.textContent =
    ".lead-error{color:#dc2626;font-size:14px;font-weight:600;margin:0 0 12px}" +
    "form.lead .lead-error:empty{display:none}" +
    ".lead-done{background:#fff;border-radius:20px;padding:36px 32px;text-align:center}" +
    ".lead-done h3{font-size:22px;color:#020617;margin:6px 0 10px;letter-spacing:-0.02em;line-height:1.2}" +
    ".lead-done p{color:#475569;font-size:15px;margin:0 0 22px}" +
    ".lead-done .btn{width:100%}" +
    ".lead-done-check{width:46px;height:46px;border-radius:50%;background:#ccfbf1;color:#0f766e;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 8px}";
  (document.head || document.documentElement).appendChild(css);

  function init() {
    var forms = document.querySelectorAll("form.lead");
    for (var i = 0; i < forms.length; i++) attach(forms[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
