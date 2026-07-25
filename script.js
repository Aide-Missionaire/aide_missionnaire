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

  const recipientEmail = "gabriel.c.loirat@gmail.com";

  document.querySelectorAll("form[data-message]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll("input, textarea, select"));
      const lines = fields
        .filter((field) => field.type !== "submit" && field.type !== "button")
        .map((field) => {
          const label = form.querySelector(`label[for="${field.id}"]`);
          const fieldName = label ? label.textContent.trim() : field.name || field.id;
          const value = field.type === "checkbox" ? (field.checked ? "Oui" : "Non") : field.value;
          return `${fieldName} : ${value}`;
        });
      const pageTitle = document.querySelector("h1, h2")?.textContent.trim() || "Formulaire";
      const subject = `Aide Missionnaire — ${pageTitle}`;
      const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

      window.location.href = mailto;
      form.reset();
    });
  });

  const stripeButton = document.querySelector("[data-fake-stripe]");
  if (stripeButton) {
    stripeButton.addEventListener("click", () => {
      window.alert("Intégration Stripe prête : connectez ici votre lien ou checkout Stripe.");
    });
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
