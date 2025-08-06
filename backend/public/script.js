// ===== Wait for DOM to Load =====
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  // ===== Contact Form Submission (Frontend Handler) =====
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

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
  }

  // ===== Load Saved Theme (Light/Dark) =====
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  // ===== Preloader Hide After Load =====
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});

// ===== ScrollReveal Animations =====
ScrollReveal().reveal('.section', {
  delay: 200,
  distance: '50px',
  duration: 800,
  easing: 'ease-in-out',
  origin: 'bottom'
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Scroll to Specific Section by ID =====
function smoothScrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ===== Toggle Mobile Menu =====
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ===== Toggle Dark Mode and Save State =====
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("darkModeIcon");
  if (icon) {
    icon.textContent = document.body.classList.contains("dark-mode") ? "🔆" : "🌙";
  }
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// ===== Header Shrink + Back to Top on Scroll =====
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  const scrollTopBtn = document.getElementById("scrollTopBtn") || document.getElementById("topBtn");

  // Shrink header on scroll
  if (window.scrollY > 20) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }

  // Show/hide scroll-to-top button
  if (scrollTopBtn) {
    scrollTopBtn.style.display = window.scrollY > 150 ? "block" : "none";
  }

  // ScrollSpy active nav
  activateNavLink();
});

// ===== ScrollSpy Highlighting =====
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

// ===== Scroll to Top Function =====
function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Section Fade-in on View =====
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

// ===== Lightbox for Service Images =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
let scale = 1;

document.querySelectorAll(".service-img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxTitle.textContent = img.dataset.title;
    lightboxDesc.textContent = img.dataset.desc;
    lightbox.style.display = "flex";
  });
});

// Close lightbox
lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
  lightboxImg.src = "";
  lightboxTitle.textContent = "";
  lightboxDesc.textContent = "";
  scale = 1;
  lightboxImg.style.transform = "scale(1)";
});

// Zoom image inside lightbox
lightboxImg?.addEventListener("wheel", function (e) {
  e.preventDefault();
  const scaleAmount = 0.1;
  scale += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  scale = Math.max(scale, 0.2);
  lightboxImg.style.transform = `scale(${scale})`;
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

// Zoom project image
projectLightboxImg?.addEventListener("wheel", function (e) {
  e.preventDefault();
  const scaleStep = 0.1;
  projectScale += e.deltaY < 0 ? scaleStep : -scaleStep;
  projectScale = Math.max(projectScale, 0.2);
  this.style.transform = `scale(${projectScale})`;
});

// ===== Project Carousel Slider =====
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

// Auto-slide every 4 seconds
let autoSlide = setInterval(() => {
  index = (index + 1) % total;
  updateSlide();
}, 4000);

// Pause carousel on hover
document.querySelector('.project-carousel')?.addEventListener('mouseenter', () => {
  clearInterval(autoSlide);
});
document.querySelector('.project-carousel')?.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => {
    index = (index + 1) % total;
    updateSlide();
  }, 4000);
});
