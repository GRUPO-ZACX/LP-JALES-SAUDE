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
      setSubject(link.dataset.subject);
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
    if (!form.elements.subject.value) {
      status.hidden = false;
      status.textContent = "Selecione o assunto para continuar.";
      document.getElementById("subject-trigger").focus();
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

  // A linha conecta os centros das três etapas e anima uma única vez.
  const process = document.querySelector(".process");
  const timeline = process.querySelector(".steps");
  function positionTimeline() {
    const marks = timeline.querySelectorAll(".step-number");
    const box = timeline.getBoundingClientRect();
    const first = marks[0].getBoundingClientRect();
    const last = marks[marks.length - 1].getBoundingClientRect();
    const horizontal = matchMedia("(min-width:960px)").matches;
    const x = first.left + first.width / 2 - box.left;
    const y = first.top + first.height / 2 - box.top;
    const length = horizontal
      ? last.left + last.width / 2 - first.left - first.width / 2
      : last.top + last.height / 2 - first.top - first.height / 2;
    timeline.style.setProperty("--track-x", `${x}px`);
    timeline.style.setProperty("--track-y", `${y}px`);
    timeline.style.setProperty(
      "--track-width",
      horizontal ? `${length}px` : "2px",
    );
    timeline.style.setProperty(
      "--track-height",
      horizontal ? "2px" : `${length}px`,
    );
  }
  positionTimeline();
  document.fonts.ready.then(positionTimeline);
  if ("ResizeObserver" in window)
    new ResizeObserver(positionTimeline).observe(timeline);
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          process.classList.add("timeline-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(timeline);
  } else {
    process.classList.add("timeline-visible");
  }

  // Seletor próprio: clique, teclado e leitores de tela usam o mesmo valor.
  const subjectTrigger = document.getElementById("subject-trigger");
  const subjectOptions = document.getElementById("subject-options");
  const subjectItems = [...subjectOptions.querySelectorAll('[role="option"]')];
  function closeSubjects(focus = false) {
    subjectOptions.hidden = true;
    subjectTrigger.setAttribute("aria-expanded", "false");
    if (focus) subjectTrigger.focus();
  }
  function setSubject(value) {
    form.elements.subject.value = value;
    document.getElementById("subject-text").textContent = value;
    subjectTrigger.classList.add("has-value");
    subjectItems.forEach((item) =>
      item.setAttribute("aria-selected", String(item.dataset.value === value)),
    );
    closeSubjects();
  }
  function openSubjects(last = false) {
    subjectOptions.hidden = false;
    subjectTrigger.setAttribute("aria-expanded", "true");
    const selected = subjectItems.find(
      (item) => item.getAttribute("aria-selected") === "true",
    );
    (selected || subjectItems[last ? subjectItems.length - 1 : 0]).focus();
  }
  subjectTrigger.addEventListener("click", () =>
    subjectOptions.hidden ? openSubjects() : closeSubjects(),
  );
  subjectTrigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      openSubjects(event.key === "ArrowUp");
    }
  });
  subjectOptions.addEventListener("click", (event) => {
    const option = event.target.closest('[role="option"]');
    if (option) {
      setSubject(option.dataset.value);
      subjectTrigger.focus();
    }
  });
  subjectOptions.addEventListener("keydown", (event) => {
    const index = subjectItems.indexOf(document.activeElement);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? subjectItems.length - 1
            : (index +
                (event.key === "ArrowDown" ? 1 : -1) +
                subjectItems.length) %
              subjectItems.length;
      subjectItems[next].focus();
    } else if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      setSubject(subjectItems[index].dataset.value);
      subjectTrigger.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSubjects(true);
    } else if (event.key === "Tab") closeSubjects();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".subject-field")) closeSubjects();
  });

  // Duas fotografias nos mesmos enquadramentos, com movimento reduzido.
  const portraits = document.querySelector(".portrait-grid");
  const reducedPhotos = matchMedia("(prefers-reduced-motion:reduce)");
  let photoTimer = null,
    photosVisible = false;
  function syncPhotos() {
    clearInterval(photoTimer);
    photoTimer = null;
    if (
      photosVisible &&
      !document.hidden &&
      !reducedPhotos.matches
    ) {
      photoTimer = setInterval(() => {
        const swapped = portraits.classList.toggle("is-swapped");
        portraits
          .querySelector(".portrait-large")
          .setAttribute(
            "aria-label",
            swapped ? "Sócia de blazer coral" : "Sócia de camisa azul",
          );
        portraits
          .querySelector(".portrait-small")
          .setAttribute(
            "aria-label",
            swapped ? "Sócia de camisa azul" : "Sócia de blazer coral",
          );
      }, 6000);
    }
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        photosVisible = entries[0].isIntersecting;
        syncPhotos();
      },
      { threshold: 0.25 },
    ).observe(portraits);
  } else {
    photosVisible = true;
    syncPhotos();
  }
  document.addEventListener("visibilitychange", syncPhotos);
  reducedPhotos.addEventListener("change", syncPhotos);
})();
