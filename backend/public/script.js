// ==============================
// CORRONiL CONTROL - script.js
// ==============================

// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const preloader = document.getElementById("preloader");

  // ===== Contact Form Submission =====
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      if (!formData.name || !formData.email || !formData.message) {
        alert("⚠️ Please fill in all fields.");
        return;
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert(data.message || "✅ Message sent successfully!");
          form.reset();
        } else {
          alert(data.message || "❌ Failed to send message.");
        }
      } catch (err) {
        console.error("Form Error:", err);
        alert("🚫 Could not connect to server.");
      }
    });
  }

  // ===== Load Saved Theme =====
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  // ===== Hide Preloader =====
  if (preloader) preloader.style.display = "none";
});

// ===== ScrollReveal Animations =====
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal(".section", {
    delay: 200,
    distance: "50px",
    duration: 800,
    easing: "ease-in-out",
    origin: "bottom",
  });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Smooth Scroll to Section by ID =====
function smoothScrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ===== Toggle Mobile Menu =====
function toggleMenu() {
  document.getElementById("navLinks")?.classList.toggle("open");
}

// ===== Toggle Dark Mode =====
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("darkModeIcon");

  if (icon) {
    icon.textContent = document.body.classList.contains("dark-mode") ? "🔆" : "🌙";
  }

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}

// ===== Header Shrink + Scroll-To-Top Button =====
const scrollTopBtn =
  document.getElementById("scrollTopBtn") ||
  document.getElementById("topBtn") ||
  document.getElementById("backToTopBtn");

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  // Shrink header
  if (window.scrollY > 20) header?.classList.add("scrolled");
  else header?.classList.remove("scrolled");

  // Show/hide top button
  if (scrollTopBtn) {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  }

  // ScrollSpy
  activateNavLink();
});

function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== ScrollSpy Highlight Active Nav Link =====
const pageSections = document.querySelectorAll("section");
const menuLinks = document.querySelectorAll(".nav-link");

function activateNavLink() {
  let currentSection = "";
  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  menuLinks.forEach((link) => {
    link.classList.toggle(
      "active-link",
      link.getAttribute("href") === `#${currentSection}`
    );
  });
}

// ===== Section Fade-in Animation =====
const sections = document.querySelectorAll(".animate-section");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        entry.target.classList.remove("hidden");
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach((section) => {
  section.classList.add("hidden");
  sectionObserver.observe(section);
});

// ===== Lightbox for Services =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
let serviceScale = 1;

document.querySelectorAll(".service-img").forEach((img) => {
  img.addEventListener("click", () => {
    if (!lightbox) return;
    lightboxImg.src = img.src;
    lightboxTitle.textContent = img.dataset.title || "";
    lightboxDesc.textContent = img.dataset.desc || "";
    lightbox.style.display = "flex";
    serviceScale = 1;
    lightboxImg.style.transform = "scale(1)";
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
  lightboxImg.src = "";
  lightboxTitle.textContent = "";
  lightboxDesc.textContent = "";
});

lightboxImg?.addEventListener("wheel", (e) => {
  e.preventDefault();
  const step = 0.1;
  serviceScale += e.deltaY < 0 ? step : -step;
  serviceScale = Math.max(serviceScale, 0.2);
  lightboxImg.style.transform = `scale(${serviceScale})`;
});

// ===== Project Lightbox =====
let projectScale = 1;
const projectLightbox = document.getElementById("project-lightbox");
const projectLightboxImg = document.getElementById("project-lightbox-img");

function openProjectLightbox(img) {
  if (!projectLightbox || !projectLightboxImg) return;
  projectLightbox.style.display = "flex";
  projectLightboxImg.src = img.src;
  projectLightboxImg.style.transform = "scale(1)";
  projectScale = 1;
}

function closeProjectLightbox() {
  if (projectLightbox) projectLightbox.style.display = "none";
  projectScale = 1;
}

projectLightboxImg?.addEventListener("wheel", (e) => {
  e.preventDefault();
  const step = 0.1;
  projectScale += e.deltaY < 0 ? step : -step;
  projectScale = Math.max(projectScale, 0.2);
  projectLightboxImg.style.transform = `scale(${projectScale})`;
});

// ===== Project Carousel =====
const wrapper = document.querySelector(".project-wrapper");
const items = document.querySelectorAll(".project-item");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
let index = 0;
const total = items.length;

function updateSlide() {
  if (wrapper) wrapper.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn?.addEventListener("click", () => {
  index = (index + 1) % total;
  updateSlide();
});

prevBtn?.addEventListener("click", () => {
  index = (index - 1 + total) % total;
  updateSlide();
});

// Auto-slide every 4s
let autoSlide = setInterval(() => {
  index = (index + 1) % total;
  updateSlide();
}, 4000);

document.querySelector(".project-carousel")?.addEventListener("mouseenter", () => {
  clearInterval(autoSlide);
});
document.querySelector(".project-carousel")?.addEventListener("mouseleave", () => {
  autoSlide = setInterval(() => {
    index = (index + 1) % total;
    updateSlide();
  }, 4000);
});
