/* ==========================================================================
   SOLOMON AGUNWACHUKWU — PORTFOLIO INTERACTIONS
   ========================================================================== */

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const copyEmailBtn = document.getElementById("copy-email-btn");
const contactForm = document.getElementById("portfolio-contact-form");
const formStatus = document.getElementById("portfolio-form-status");

// Mobile Navigation Drawer
navToggle.addEventListener("click", () => {
  const expanded = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(expanded));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Copy Email to Clipboard
copyEmailBtn.addEventListener("click", async () => {
  const email = "solomonagunwachukwu@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    copyEmailBtn.textContent = "Copied!";
    setTimeout(() => {
      copyEmailBtn.textContent = "Copy";
    }, 2000);
  } catch {
    copyEmailBtn.textContent = "solomonagunwachukwu@gmail.com";
  }
});

// Direct Note Form (Opens pre-populated mailto client cleanly)
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("sender-name").value.trim();
  const email = document.getElementById("sender-email").value.trim();
  const message = document.getElementById("sender-message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in your name, email address, and message.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio Enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}
Email: ${email}

${message}`);
  formStatus.textContent = "Opening your default email client with your message...";
  window.location.href = `mailto:solomonagunwachukwu@gmail.com?subject=${subject}&body=${body}`;
});

// Scroll Reveal Animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Active Section Highlighting in Navigation
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let currentId = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentId = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${currentId}`);
  });
});

// Current Footer Year
document.getElementById("year").textContent = String(new Date().getFullYear());
