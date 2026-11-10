(() => {
  const asciiLogo = document.querySelector(".ascii-logo");
  const asciiLines = asciiLogo.textContent
    .replace(/\u2800/g, " ")
    .split("\n");
  const asciiContent = document.createDocumentFragment();

  asciiLines.forEach((line, row) => {
    Array.from(line).forEach((character, column) => {
      if (character === " ") {
        asciiContent.append(document.createTextNode(character));
        return;
      }

      const glyph = document.createElement("span");
      glyph.className = "ascii-char";
      glyph.style.setProperty(
        "--delay",
        `${-((row * 97 + column * 53) % 3200)}ms`,
      );
      glyph.textContent = character;
      asciiContent.append(glyph);
    });

    if (row < asciiLines.length - 1) {
      asciiContent.append(document.createTextNode("\n"));
    }
  });

  asciiLogo.replaceChildren(asciiContent);

  const introCopy = document.querySelector(".intro-copy-text");
  const introText = introCopy.textContent;

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let characterCount = 0;
    introCopy.textContent = "";
    introCopy.closest(".intro-copy").classList.add("is-typing");

    const typeNextCharacter = () => {
      characterCount += 1;
      introCopy.textContent = introText.slice(0, characterCount);

      if (characterCount < introText.length) {
        window.setTimeout(typeNextCharacter, 85);
      } else {
        window.setTimeout(deleteNextCharacter, 2400);
      }
    };

    const deleteNextCharacter = () => {
      characterCount -= 1;
      introCopy.textContent = introText.slice(0, characterCount);

      if (characterCount > 0) {
        window.setTimeout(deleteNextCharacter, 45);
      } else {
        window.setTimeout(typeNextCharacter, 900);
      }
    };

    window.setTimeout(typeNextCharacter, 650);
  }

  document.addEventListener("copy", (event) => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.anchorNode &&
      asciiLogo.contains(selection.anchorNode)
    ) {
      event.preventDefault();
    }
  });

  const revealSections = document.querySelectorAll(
    ".content-section, .contact-section",
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealSections.forEach((section) => {
      section.classList.add("reveal-ready");
      revealObserver.observe(section);
    });
  }

  const copyEmailButton = document.querySelector(".contact-copy");
  const copyFeedback = document.querySelector(".copy-feedback");

  copyEmailButton.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyEmailButton.dataset.copy);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = copyEmailButton.dataset.copy;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        let copied = false;

        try {
          temporaryInput.select();
          copied = document.execCommand("copy");
        } finally {
          temporaryInput.remove();
        }

        if (!copied) {
          throw new Error("No se pudo copiar el correo.");
        }
      }

      copyFeedback.textContent = "¡copiado!";
    } catch {
      copyFeedback.textContent = "No se pudo copiar. Seleccioná el correo.";
    }
  });
})();
