document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const yearTarget = document.querySelector("#current-year");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const opened = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const counters = document.querySelectorAll(".key-num[data-count]");
  if (counters.length) {
    const duration = 2400;
    const easeOut = (t) => 1 - (1 - t) ** 3;

    const animateCounter = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = `${Math.round(easeOut(progress) * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.45 },
    );

    counters.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll(".footer-grid").forEach((footer) => {
    const newsletter = Array.from(footer.children).find(
      (section) => section.querySelector(".footer-title")?.textContent.trim() === "Newsletter",
    );
    newsletter?.remove();
    footer.querySelectorAll('a[href="mentions-legales.html"], a[href="politique-confidentialite.html"]').forEach((link) => {
      link.closest("li")?.remove();
    });

    const legalLinks = document.createElement("div");
    legalLinks.innerHTML = `
      <h3 class="footer-title">Informations légales</h3>
      <ul class="footer-list">
        <li><a href="https://aide-missionnaire.netlify.app/mentions-legales">Mentions légales</a></li>
        <li><a href="https://aide-missionnaire.netlify.app/politique-confidentialite">Politique de confidentialité</a></li>
      </ul>`;
    footer.append(legalLinks);
  });

  const recipientEmail = "aidemissionnaire@gmail.com";

  document.querySelectorAll("form[data-message]").forEach((form) => {
    const status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("aria-live", "polite");
    form.append(status);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll("input, textarea, select"));
      const payload = {};
      fields
        .filter((field) => field.type !== "submit" && field.type !== "button")
        .forEach((field) => {
          const label = form.querySelector(`label[for="${field.id}"]`);
          const baseName = label ? label.textContent.trim() : field.name || field.id;
          let fieldName = baseName;
          let count = 2;

          while (Object.prototype.hasOwnProperty.call(payload, fieldName)) {
            fieldName = `${baseName} (${count})`;
            count += 1;
          }

          payload[fieldName] = field.type === "checkbox" ? (field.checked ? "Oui" : "Non") : field.value;
        });
      const pageTitle = document.querySelector("h1, h2")?.textContent.trim() || "Formulaire";
      const submitButton = form.querySelector('button[type="submit"]');
      const emailField = fields.find((field) => field.type === "email" && field.value);

      payload._subject = `Aide Missionnaire — ${pageTitle}`;
      payload._template = "table";
      if (emailField) payload._replyto = emailField.value;

      status.textContent = "Envoi en cours…";
      status.classList.remove("is-success", "is-error");
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Échec de l’envoi");
        form.reset();
        status.textContent = "Message envoyé !";
        status.classList.add("is-success");
      } catch (error) {
        status.textContent = "L’envoi a échoué. Veuillez réessayer.";
        status.classList.add("is-error");
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });

  const sponsorshipForm = document.querySelector(".parrainage-form form");
  if (sponsorshipForm) {
    const annualInput = sponsorshipForm.querySelector("#total-annuel");
    const totalInput = sponsorshipForm.querySelector("#total");
    const amountChecks = sponsorshipForm.querySelectorAll("input[data-amount]");
    const annualInputs = sponsorshipForm.querySelectorAll(".js-sum-annual");
    const extraInputs = sponsorshipForm.querySelectorAll(".js-sum");

    const sumFields = (fields) =>
      Array.from(fields).reduce((sum, field) => sum + (Number(field.value) || 0), 0);

    const updateTotal = () => {
      let annual = sumFields(annualInputs);
      amountChecks.forEach((checkbox) => {
        if (checkbox.checked) annual += Number(checkbox.dataset.amount) || 0;
      });
      const extra = sumFields(extraInputs);
      if (annualInput) annualInput.value = String(annual);
      if (totalInput) totalInput.value = String(extra);
    };

    sponsorshipForm.addEventListener("input", updateTotal);
    sponsorshipForm.addEventListener("change", updateTotal);
    updateTotal();
  }
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");

  if (track && prevBtn && nextBtn) {
    const slideWidth = () => {
      const slide = track.querySelector(".slide");
      return slide ? slide.getBoundingClientRect().width + 12 : 320;
    };

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -slideWidth(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: slideWidth(), behavior: "smooth" });
    });
  }

  const beforeAfter = document.querySelector(".before-after");
  if (beforeAfter) {
    const range = beforeAfter.querySelector(".ba-range");
    const beforeLayer = beforeAfter.querySelector(".before-layer");
    const divider = beforeAfter.querySelector(".divider");
    const handle = beforeAfter.querySelector(".ba-handle");

    const updateComparison = (value) => {
      const numeric = Math.max(0, Math.min(100, value));
      const percent = `${numeric}%`;
      beforeLayer.style.clipPath = `inset(0 ${100 - numeric}% 0 0)`;
      divider.style.left = percent;
      handle.style.left = percent;
    };

    if (range && beforeLayer && divider && handle) {
      updateComparison(Number(range.value));
      range.addEventListener("input", () => updateComparison(Number(range.value)));
    }
  }
});
