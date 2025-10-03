  const BACKEND_URL = 'http://127.0.0.1:5501';
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      mobileNav.classList.remove("active");
    });
  });

  document.addEventListener("click", e => {
    if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileMenuToggle.classList.remove("active");
      mobileNav.classList.remove("active");
    }
  });

  const infoTextDisplay = document.getElementById('info-display-text');
  const socialLinks = document.querySelectorAll('.social-links a');
  const defaultText = infoTextDisplay ? infoTextDisplay.textContent.trim() : '';
  let activeLink = null;

  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const newText = this.getAttribute('data-info-text');
      if (!infoTextDisplay || !newText) return;
      if (this === activeLink) {
        infoTextDisplay.textContent = defaultText;
        this.classList.remove('active-info-link');
        activeLink = null;
      } else {
        if (activeLink) activeLink.classList.remove('active-info-link');
        infoTextDisplay.textContent = newText;
        this.classList.add('active-info-link');
        activeLink = this;
      }
      this.classList.toggle('active-tooltip');
      document.querySelectorAll('.social-links a.active-tooltip').forEach(otherLink => {
        if (otherLink !== this) otherLink.classList.remove('active-tooltip');
      });
    });
  });

  document.addEventListener('click', e => {
    document.querySelectorAll('.social-links a.active-tooltip').forEach(link => {
      if (!link.contains(e.target)) link.classList.remove('active-tooltip');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.classList.toggle("scrolled", window.pageYOffset > 50);
  });

  function updateActiveMenuItem() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");
    let currentSection = "";
    const scrollPos = window.pageYOffset + 100;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) link.classList.add("active");
    });
  }

  window.addEventListener("scroll", updateActiveMenuItem);
  window.addEventListener("load", updateActiveMenuItem);

  const shapes = document.querySelectorAll(".shape");
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.3;
      shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
  });

  const neuralLines = document.querySelectorAll(".neural-line");
  setInterval(() => {
    neuralLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "scaleX(1.2)";
        setTimeout(() => {
          line.style.opacity = "0.2";
          line.style.transform = "scaleX(0.5)";
        }, 200);
      }, index * 300);
    });
  }, 2000);

  function createQuantumParticle() {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    const size = Math.random() * 4 + 1;
    particle.style.width = particle.style.height = `${size}px`;
    particle.style.background = ["#00ffff", "#ff0080", "#8000ff"][Math.floor(Math.random() * 3)];
    particle.style.borderRadius = "50%";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = "100vh";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "-1";
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
    document.body.appendChild(particle);
    const duration = Math.random() * 3000 + 2000;
    const drift = (Math.random() - 0.5) * 200;
    particle.animate([
      { transform: "translateY(0px) translateX(0px)", opacity: 0 },
      { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 1 }
    ], { duration: duration, easing: "ease-out" }).onfinish = () => particle.remove();
  }

  setInterval(createQuantumParticle, 1500);

  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".timeline-content, .hexagon").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });

  document.getElementById('upload').addEventListener('change', function() {
    const fileNameDisplay = document.querySelector('.file-name-display');
    fileNameDisplay.textContent = this.files[0]?.name || 'No file selected.';
  });

  document.querySelector(".submit-btn").addEventListener("click", async function(e) {
    e.preventDefault();
    const nicknameInput = document.querySelector('input[placeholder="Your Nickname (English)"]');
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    if (!file || !nicknameInput.value.trim()) {
      alert("Please select a file and enter your nickname.");
      return;
    }
    const formData = new FormData();
    formData.append("nickname", nicknameInput.value.trim());
    formData.append("file", file);
    const btn = this;
    btn.innerHTML = '<span style="background-color:#5b21b6;padding:4px 12px;border-radius:6px;color:#fff">SUBMITTING...</span>';
    btn.disabled = true;
    try {
      const response = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
      const data = await response.json();
      btn.innerHTML = data.status === "success" 
        ? '<span style="background-color:#10b981;padding:4px 12px;border-radius:6px;color:#fff">SUBMIT COMPLETED</span>' 
        : '<span style="background-color:#ef4444;padding:4px 12px;border-radius:6px;color:#fff">SUBMIT FAILED</span>';
    } catch {
      btn.innerHTML = '<span style="background-color:#ef4444;padding:4px 12px;border-radius:6px;color:#fff">ERROR</span>';
    } finally {
      setTimeout(() => {
        btn.innerHTML = '<span style="background-color:#5b21b6;padding:4px 12px;border-radius:6px;color:#fff">SUBMIT</span>';
        btn.disabled = false;
        fileInput.value = "";
        document.querySelector(".file-name-display").textContent = "No file selected.";
      }, 2000);
    }
  });
