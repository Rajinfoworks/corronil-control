// --- FRONTEND CODE (Browser) ---
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple validation
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Message sent successfully!");
        form.reset();
      } else {
        alert("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred while sending the message.");
    }
  });
});

ScrollReveal().reveal('.section', {
  delay: 200,
  distance: '50px',
  duration: 800,
  easing: 'ease-in-out',
  origin: 'bottom'
});

// ===== Contact Form (Backend Submission) =====
document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = {
    name: this.name.value.trim(),
    email: this.email.value.trim(),
    message: this.message.value.trim()
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    alert(data.message || 'Form submitted!');
    this.reset();
  } catch (err) {
    alert('❌ Submission failed. Check server is running.');
    console.error(err);
  }
});

// ===== Smooth Scroll Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function smoothScrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
window.addEventListener('scroll', myFunc, { passive: true });

// ===== Toggle Mobile Menu =====
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ===== Toggle Dark Mode =====
function toggleMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// ===== Load Theme on Load =====
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
});

// ===== Header Shrink on Scroll =====
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Back to top visibility
  const btn = document.getElementById("scrollTopBtn") || document.getElementById("topBtn");
  if (btn) {
    btn.style.display = window.scrollY > 150 ? "block" : "none";
  }
});

// ===== ScrollSpy =====
const pageSections = document.querySelectorAll("section");
const menuLinks = document.querySelectorAll(".nav-link");

function activateNavLink() {
  let currentSection = "";
  pageSections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active-link");
    }
  });
}
window.addEventListener("scroll", activateNavLink);

// ===== Scroll to Top =====
function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Preloader =====
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) preloader.style.display = "none";
});

// ===== Scroll Animations =====
const sections = document.querySelectorAll(".animate-section");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      entry.target.classList.remove("hidden");
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

sections.forEach((section) => {
  section.classList.add("hidden");
  sectionObserver.observe(section);
});

// ===== Lightbox (Service) =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");

document.querySelectorAll(".service-img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxTitle.textContent = img.dataset.title;
    lightboxDesc.textContent = img.dataset.desc;
    lightbox.style.display = "flex";
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
  lightboxImg.src = "";
  lightboxTitle.textContent = "";
  lightboxDesc.textContent = "";
});

// ===== Lightbox Zoom (Service) =====
let scale = 1;
lightboxImg?.addEventListener("wheel", function (e) {
  e.preventDefault();
  const scaleAmount = 0.1;
  scale += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  scale = Math.max(scale, 0.2);
  lightboxImg.style.transform = `scale(${scale})`;
});

// Reset zoom on close
lightbox?.addEventListener("click", () => {
  scale = 1;
  lightboxImg.style.transform = "scale(1)";
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
  if (!projectLightbox) return;
  projectLightbox.style.display = "none";
  projectScale = 1;
}

projectLightboxImg?.addEventListener("wheel", function (e) {
  e.preventDefault();
  const scaleStep = 0.1;
  projectScale += e.deltaY < 0 ? scaleStep : -scaleStep;
  projectScale = Math.max(projectScale, 0.2);
  this.style.transform = `scale(${projectScale})`;
});

// ===== Project Carousel =====
const wrapper = document.querySelector('.project-wrapper');
const items = document.querySelectorAll('.project-item');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
let index = 0;
const total = items.length;

function updateSlide() {
  wrapper.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn?.addEventListener('click', () => {
  index = (index + 1) % total;
  updateSlide();
});

prevBtn?.addEventListener('click', () => {
  index = (index - 1 + total) % total;
  updateSlide();
});

// Auto-slide
let autoSlide = setInterval(() => {
  index = (index + 1) % total;
  updateSlide();
}, 4000);

// Pause on hover
document.querySelector('.project-carousel')?.addEventListener('mouseenter', () => {
  clearInterval(autoSlide);
});
document.querySelector('.project-carousel')?.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => {
    index = (index + 1) % total;
    updateSlide();
  }, 4000);
});

// ===== Dark Mode Icon Switcher =====
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("darkModeIcon");
  if (icon) icon.textContent = document.body.classList.contains("dark-mode") ? "🔆" : "🌙";
}
