(() => {
  "use strict";

  const EMAIL_STORAGE_KEY = "netflix_email";

  function isValidEmail(value) {
    if (!value) return false;
    // Simple, practical email check (not fully RFC-compliant, but good UX)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function showInlineMessage(inputEl, message) {
    if (!inputEl) return;

    // Remove old message in the same container
    const container = inputEl.parentElement || inputEl;
    const old = container.querySelector("[data-inline-email-msg]");
    if (old) old.remove();

    const msg = document.createElement("div");
    msg.setAttribute("data-inline-email-msg", "true");
    msg.style.marginTop = "10px";
    msg.style.fontFamily = "Poppins, sans-serif";
    msg.style.fontSize = "14px";
    msg.style.color = message.includes("success") ? "#2ecc71" : "#e87c7c";
    msg.textContent = message;

    // Ensure container is positioned (safe no-op)
    if (container !== inputEl) {
      container.appendChild(msg);
    } else {
      inputEl.insertAdjacentElement("afterend", msg);
    }
  }

  function bindGetStartedButtons() {
    const starts = document.querySelectorAll(".btns2 .stbtn, .btns6 .stbtn");

    starts.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Find the input near the clicked button
        const container = btn.closest(".btns2, .btns6") || btn.parentElement;
        const input = container ? container.querySelector("input.txt4") : null;

        if (!input) return;

        const email = input.value;

        if (!isValidEmail(email)) {
          showInlineMessage(
            input,
            "Please enter a valid email address to continue."
          );
          input.focus();
          return;
        }

        try {
          localStorage.setItem(EMAIL_STORAGE_KEY, String(email).trim());
        } catch (_) {
          // Ignore storage failures
        }

        showInlineMessage(input, "Email looks good. (Demo) Continuing… success");
      });
    });

    // Prefill if we have stored email
    try {
      const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (saved) {
        document.querySelectorAll("input.txt4").forEach((el) => {
          el.value = saved;
        });
      }
    } catch (_) {
      // Ignore
    }
  }

  function bindFaq() {
    const faqBoxes = document.querySelectorAll(".faqbox");

    faqBoxes.forEach((box) => {
      box.setAttribute("role", "button");
      box.setAttribute("tabindex", "0");
      box.style.userSelect = "none";

      // Create answer panel dynamically if missing
      // Your HTML currently only has the question and a plus icon.
      // We'll add an answer area right after the question span.
      const ensurePanel = () => {
        let panel = box.querySelector(".faq-answer");
        if (panel) return panel;

        panel = document.createElement("div");
        panel.className = "faq-answer";
        panel.style.maxHeight = "0px";
        panel.style.overflow = "hidden";
        panel.style.transition = "max-height 220ms ease";
        panel.style.padding = "0 24px";
        panel.style.marginTop = "0px";
        panel.style.color = "#cfcfcf";
        panel.style.fontFamily = "Poppins, sans-serif";
        panel.style.fontSize = "14px";

        const questionText = (box.querySelector("span")?.textContent || "").trim();

        // Generic answers (since your HTML doesn’t include them yet)
        const answers = {
          "What is netflix":
            "Netflix is a streaming service where you can watch movies and TV shows online. (Demo text)",
          "How much does Netflix cost?":
            "Plans start from ₹149. Cancel anytime. (Demo text)",
          "What can I watch on Netflix?":
            "You can watch a variety of movies, series, and documentaries. (Demo text)",
          "Where can I watch?":
            "Stream on smart TVs, phones, tablets, laptops, and more. (Demo text)",
        };

        const key = questionText;
        const answerText = answers[key] ||
          "More details coming soon. (Demo text)";

        panel.textContent = answerText;
        box.appendChild(panel);
        return panel;
      };

      const toggle = () => {
        const panel = ensurePanel();
        const isOpen = box.classList.contains("faq-open");

        if (isOpen) {
          box.classList.remove("faq-open");
          panel.style.maxHeight = "0px";
        } else {
          box.classList.add("faq-open");
          // Set to scrollHeight for smooth transition
          const target = panel.scrollHeight;
          panel.style.maxHeight = `${target}px`;
        }

        // Rotate icon (your svg looks like a plus; we’ll rotate it)
        const svg = box.querySelector("svg");
        if (svg) {
          svg.style.transition = "transform 200ms ease";
          svg.style.transform = isOpen ? "rotate(0deg)" : "rotate(45deg)";
        }
      };

      box.addEventListener("click", toggle);
      box.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          toggle();
        }
      });
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    bindGetStartedButtons();
    bindFaq();
  });
})();

