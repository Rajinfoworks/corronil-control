// ==============================
// CORRONiL CONTROL - Optimized script.js
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const preloader = document.getElementById("preloader");
  const messageEl = document.getElementById("form-message");
  const body = document.body;
  const darkModeIcon = document.getElementById("darkModeIcon");

  // ===== Hide Preloader =====
  if (preloader) preloader.style.display = "none";

  // ===== Load Saved Theme =====
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark-mode");
  if(darkModeIcon) darkModeIcon.textContent = body.classList.contains("dark-mode") ? "🔆" : "🌙";

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
        if(messageEl) {
          messageEl.textContent = "⚠️ Please fill in all fields.";
          messageEl.classList.add("error");
        }
        return;
      }

      const baseUrl = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://www.corronilcontrol.com";

try {
  const res = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (res.ok && data.success) {
    if(messageEl) {
      messageEl.textContent = data.message || "✅ Message sent successfully!";
      messageEl.classList.remove("error");
      messageEl.classList.add("success");
    }
    form.reset();
  } else {
    if(messageEl) {
      messageEl.textContent = data.message || "❌ Failed to send message.";
      messageEl.classList.add("error");
    }
  }
} catch (err) {
  console.error("Form Error:", err);
  if(messageEl) {
    messageEl.textContent = "🚫 Could not connect to server.";
    messageEl.classList.add("error");
  }
}

    });
  }

  // ===== Dark Mode Toggle =====
  window.toggleDarkMode = () => {
    body.classList.toggle("dark-mode");
    if(darkModeIcon) darkModeIcon.textContent = body.classList.contains("dark-mode") ? "🔆" : "🌙";
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  };

// ===== Mobile Menu Toggle =====
const navLinks = document.querySelector(".nav-container");
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && navLinks) {
  // Toggle menu on hamburger click
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when clicking a nav link
  navLinks.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}


  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if(target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
 
  
  // ===== ScrollSpy + Header Shrink + Scroll-to-Top =====
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const header = document.querySelector("header");
  const pageSections = document.querySelectorAll("section");
  const menuLinks = document.querySelectorAll(".nav-link");

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollY = window.scrollY;

      // Header shrink
      if(header) header.classList.toggle("scrolled", scrollY > 20);

      /// ===== Back-to-Top Button =====
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if(scrollTopBtn) scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

if(scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


      
      // ScrollSpy
      let currentSection = "";
      pageSections.forEach(section => {
        if(scrollY >= section.offsetTop - 150) currentSection = section.getAttribute("id");
      });
      menuLinks.forEach(link => link.classList.toggle("active-link", link.getAttribute("href") === `#${currentSection}`));
    }, 50);
  });

  window.topFunction = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ===== Intersection Observer Animations =====
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("fade-in");
        entry.target.classList.remove("hidden");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".animate-section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
  });

  // ===== Reveal on Scroll (Generic) =====
  function revealOnScroll(selector, rootMargin="0px") {
    const elements = document.querySelectorAll(selector);
    const obs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, idx) => {
        if(entry.isIntersecting){
          setTimeout(() => entry.target.classList.add("visible"), idx * 150);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin, threshold: 0.2 });
    elements.forEach(el => obs.observe(el));
  }
  revealOnScroll(".project-card");
  revealOnScroll(".service-card");

  // ===== Lightbox =====
  function setupLightbox(sectionSelector, lightboxId, imgSelector, titleSelector, descSelector){
    const lightbox = document.getElementById(lightboxId);
    const lightboxImg = document.getElementById(imgSelector);
    const lightboxTitle = titleSelector ? document.getElementById(titleSelector) : null;
    const lightboxDesc = descSelector ? document.getElementById(descSelector) : null;
    let scale = 1;

    document.querySelectorAll(sectionSelector).forEach(img => {
      img.addEventListener("click", () => {
        if(!lightbox) return;
        lightboxImg.src = img.src;
        if(lightboxTitle) lightboxTitle.textContent = img.dataset.title || "Untitled";
        if(lightboxDesc) lightboxDesc.textContent = img.dataset.desc || "No description available.";
        lightbox.style.display = "flex";
        scale = 1;
        lightboxImg.style.transform = "scale(1)";
      });
    });

    lightbox?.addEventListener("click", () => {
      lightbox.style.display = "none";
      lightboxImg.src = "";
      if(lightboxTitle) lightboxTitle.textContent = "";
      if(lightboxDesc) lightboxDesc.textContent = "";
    });

    lightboxImg?.addEventListener("wheel", (e) => {
      e.preventDefault();
      scale += e.deltaY < 0 ? 0.1 : -0.1;
      scale = Math.max(scale, 0.2);
      lightboxImg.style.transform = `scale(${scale})`;
    });
  }

  setupLightbox(".service-card img","service-lightbox","service-lightbox-img","service-lightbox-title","service-lightbox-desc");
  setupLightbox(".project-card img","project-lightbox","project-lightbox-img","project-lightbox-title","project-lightbox-desc");

  // ===== Project Carousel =====
  const wrapper = document.querySelector(".project-wrapper");
  const items = document.querySelectorAll(".project-item");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  let index = 0;
  const total = items.length;

  const updateSlide = () => {
    if(wrapper) wrapper.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn?.addEventListener("click", () => { index = (index+1)%total; updateSlide(); });
  prevBtn?.addEventListener("click", () => { index = (index-1+total)%total; updateSlide(); });

  let autoSlide = setInterval(() => { index = (index+1)%total; updateSlide(); }, 4000);

  const carouselEl = document.querySelector(".project-carousel");
  carouselEl?.addEventListener("mouseenter", () => clearInterval(autoSlide));
  carouselEl?.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => { index = (index+1)%total; updateSlide(); }, 4000);
  });

  // ===== ScrollReveal Fallback =====
  if(typeof ScrollReveal !== "undefined"){
    ScrollReveal().reveal(".section",{ delay:200, distance:"50px", duration:800, easing:"ease-in-out", origin:"bottom" });
  }
});

// ===== Smooth Scroll Function for Buttons =====
window.smoothScrollTo = (sectionId) => {
  const target = document.getElementById(sectionId);
  if(target) target.scrollIntoView({ behavior: "smooth" });
};

/* =========================
   Disable Right-Click & Developer Shortcuts
========================= */

// Disable right-click
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    alert("Right-click is disabled on this website.");
});

// Disable common keyboard shortcuts
document.addEventListener("keydown", function(e) {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === "F12" || // F12
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || // Ctrl+Shift+I/J
        (e.ctrlKey && e.key === "U") // Ctrl+U
    ) {
        e.preventDefault();
        alert("This action is disabled on this website.");
    }
});
