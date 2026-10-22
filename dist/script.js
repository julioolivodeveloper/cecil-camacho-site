const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");
const focusTabs = [...document.querySelectorAll("[data-focus-tab]")];
const focusPanels = [...document.querySelectorAll("[data-focus-panel]")];
const methodSteps = [...document.querySelectorAll("[data-step]")];
const methodResult = document.querySelector("[data-step-result]");
const chatOpeners = [...document.querySelectorAll("[data-open-chat]")];
const floatingChat = document.querySelector("[data-floating-chat]");
const chatAreas = [...document.querySelectorAll("[data-chat], [data-floating-chat]")];
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");

const methodMessages = [
  "Nombrar lo que quieres cambiar y separar lo urgente de lo importante.",
  "Elegir acciones pequeñas que puedas repetir hasta convertirlas en identidad.",
  "Medir avances, ajustar sin culpa y volver a comprometerte con tu propósito."
];

const botReplies = [
  {
    keys: ["hotmart", "pnl", "programacion", "neurolinguistica", "neurolingüística", "comprar", "libro"],
    text: "El libro de Programación Neurolingüística está disponible en Hotmart. Puedes abrir la compra directa desde la sección Libros."
  },
  {
    keys: ["disciplina", "habito", "hábito", "constancia", "rutina"],
    text: "Para empezar con disciplina, elige una acción pequeña, una hora concreta y una razón emocional clara. La meta es repetir antes de exigir perfección."
  },
  {
    keys: ["equilibrio", "emocional", "ansiedad", "calma"],
    text: "El equilibrio emocional empieza con pausa, nombre y elección: pausa la reacción, nombra lo que sientes y elige una acción que cuide tu paz."
  },
  {
    keys: ["contacto", "redes", "instagram", "facebook", "tiktok", "cecil"],
    text: "Puedes conectar con Cecil desde TikTok, Instagram o Facebook. Los enlaces están en la sección del asistente."
  }
];

function updateHeader() {
  header.classList.toggle("is-solid", window.scrollY > 24);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function switchFocus(target) {
  focusTabs.forEach((tab) => {
    const isActive = tab.dataset.focusTab === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  focusPanels.forEach((panel) => {
    panel.hidden = panel.dataset.focusPanel !== target;
  });
}

function setMethodStep(index) {
  methodSteps.forEach((step) => step.classList.toggle("is-active", step.dataset.step === String(index)));
  methodResult.textContent = methodMessages[index];
}

function addMessage(log, text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  log.append(message);
  log.scrollTop = log.scrollHeight;
}

function seedChat(area) {
  const log = area.querySelector("[data-chat-log]");
  if (!log || log.dataset.ready) return;
  addMessage(log, "Hola, soy el asistente MCC. Puedo orientarte sobre libros, disciplina, PNL o contacto con Cecil.", "bot");
  log.dataset.ready = "true";
}

function getReply(message) {
  const normalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = botReplies.find((reply) => reply.keys.some((key) => normalized.includes(key.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
  return match
    ? match.text
    : "Gracias por escribir. Te recomiendo empezar por definir qué quieres cambiar: mente, disciplina, equilibrio emocional o contacto con Cecil.";
}

function handleChatSubmit(form, textOverride) {
  const input = form.querySelector("input");
  const message = (textOverride || input.value).trim();
  if (!message) return;

  const area = form.closest("[data-chat], [data-floating-chat]");
  const log = area.querySelector("[data-chat-log]");
  seedChat(area);
  addMessage(log, message, "user");
  input.value = "";

  window.setTimeout(() => {
    addMessage(log, getReply(message), "bot");
  }, 320);
}

function openChat() {
  floatingChat.hidden = false;
  document.body.classList.add("chat-open");
  seedChat(floatingChat);
  const input = floatingChat.querySelector("input");
  window.setTimeout(() => input.focus(), 50);
}

function closeChat() {
  floatingChat.hidden = true;
  document.body.classList.remove("chat-open");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});

focusTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchFocus(tab.dataset.focusTab));
});

methodSteps.forEach((step) => {
  step.addEventListener("click", () => setMethodStep(Number(step.dataset.step)));
});

chatOpeners.forEach((opener) => opener.addEventListener("click", openChat));

chatAreas.forEach((area) => {
  seedChat(area);
  area.querySelectorAll("[data-reply]").forEach((button) => {
    button.addEventListener("click", () => {
      const form = area.querySelector("[data-chat-form]");
      handleChatSubmit(form, button.dataset.reply);
    });
  });
  area.querySelector("[data-chat-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    handleChatSubmit(event.currentTarget);
  });
});

document.querySelectorAll("[data-close-chat]").forEach((button) => {
  button.addEventListener("click", closeChat);
});

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    modalImage.src = button.dataset.gallery;
    modalImage.alt = button.querySelector("img").alt;
    modal.showModal();
  });
});

document.querySelector("[data-close-modal]").addEventListener("click", () => modal.close());

document.querySelectorAll("[data-course-checkout]").forEach((button) => {
  button.addEventListener("click", () => {
    window.open("https://pay.hotmart.com/H108023409H?checkoutMode=2", "_blank", "noopener,noreferrer");
  });
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeChat();
  }
});
