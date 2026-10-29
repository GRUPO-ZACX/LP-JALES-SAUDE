(() => {
  "use strict";
  const config = window.JALES_CONFIG || {};
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  function closeMenu(restoreFocus = false) {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    toggle.setAttribute("aria-expanded", String(opening));
    if (opening) menu.querySelector(".menu-close").focus();
  });
  menu
    .querySelector(".menu-close")
    .addEventListener("click", () => closeMenu(true));
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    )
      closeMenu();
  });
  matchMedia("(min-width:960px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const carousel = document.querySelector(".treatment-cards");
  carousel.addEventListener("keydown", (event) => {
    if (
      event.target !== carousel ||
      !["ArrowLeft", "ArrowRight"].includes(event.key) ||
      carousel.scrollWidth <= carousel.clientWidth
    )
      return;
    event.preventDefault();
    const distance =
      carousel.firstElementChild.getBoundingClientRect().width +
      parseFloat(getComputedStyle(carousel).gap);
    carousel.scrollBy({
      left: event.key === "ArrowRight" ? distance : -distance,
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  document.querySelectorAll("[data-subject]").forEach((link) =>
    link.addEventListener("click", () => {
      document.querySelector('[name="subject"]').value = link.dataset.subject;
    }),
  );

  const form = document.getElementById("contact-form");
  const phone = form.elements.phone;
  const status = document.getElementById("form-status");
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      phone.setCustomValidity("Informe um telefone válido, com DDD.");
      phone.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    const destination = String(config.whatsapp || "").replace(/\D/g, "");
    status.hidden = false;
    if (!/^\d{10,15}$/.test(destination)) {
      status.textContent =
        "O contato pelo site está temporariamente indisponível. Seus dados não foram enviados. Tente novamente mais tarde.";
      return;
    }
    const message = `Olá! Meu nome é ${form.elements.name.value.trim()}. Gostaria de conversar sobre ${form.elements.subject.value}. Meu WhatsApp é ${phone.value.trim()}.`;
    const url = `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
    status.textContent =
      "Você será direcionado ao WhatsApp para confirmar o envio da sua mensagem.";
    window.location.assign(url);
  });
  document.getElementById("feedback-button").addEventListener("click", () => {
    let url;
    try {
      url = new URL(config.reviewsUrl);
    } catch {
      url = null;
    }
    if (url && ["https:", "http:"].includes(url.protocol)) {
      window.open(url.href, "_blank", "noopener,noreferrer");
    } else {
      const message = document.getElementById("feedback-status");
      message.hidden = false;
      message.textContent = "O canal de avaliações estará disponível em breve.";
    }
  });
})();
