(function () {
  const canvas = document.querySelector('.home-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
  let particles = [];
  let animationId = null;
  let mouse = { x: null, y: null, active: false };

  const CONFIG = {
    baseColorA: getComputedStyle(document.documentElement).getPropertyValue('--ring-1').trim() || '#7c3aed',
    baseColorB: getComputedStyle(document.documentElement).getPropertyValue('--ring-2').trim() || '#ffe600',
    bgColor: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0f1724',
    minParticles: 30,
    maxParticles: 120,
    linkDistance: 140,
    maxRadius: 6,
    minRadius: 1.6,
    speedFactor: 0.25,
    jitterStrength: 0.03,
    minSpeed: 0.18,
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(100, Math.floor(rect.width));
    h = Math.max(100, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = w * h;
    const approx = Math.floor(area / 80000);
    const count = Math.max(CONFIG.minParticles, Math.min(CONFIG.maxParticles, approx));
    initParticles(count);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      const r = rand(CONFIG.minRadius, CONFIG.maxRadius);
      const p = {
        x: rand(r, w - r),
        y: rand(r, h - r),
        vx: rand(-1, 1) * (1 + Math.random()) * CONFIG.speedFactor,
        vy: rand(-1, 1) * (1 + Math.random()) * CONFIG.speedFactor,
        r,
        hue: Math.random(),
        alpha: rand(0.35, 0.95)
      };
      ensureMinSpeed(p);
      particles.push(p);
    }
  }

  function ensureMinSpeed(p) {
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed < CONFIG.minSpeed) {
      const ang = Math.random() * Math.PI * 2;
      p.vx += Math.cos(ang) * (CONFIG.minSpeed + Math.random() * 0.2);
      p.vy += Math.sin(ang) * (CONFIG.minSpeed + Math.random() * 0.2);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const linkDist2 = CONFIG.linkDistance * CONFIG.linkDistance;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 <= linkDist2) {
          const t = 1 - (d2 / linkDist2);
          const lineAlpha = t * 0.18 * Math.min(a.alpha, b.alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, hexWithAlpha(CONFIG.baseColorA, lineAlpha));
          g.addColorStop(1, hexWithAlpha(CONFIG.baseColorB, lineAlpha));
          ctx.strokeStyle = g;
          ctx.lineWidth = Math.max(0.35, 1.2 * t);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      const color = interpolateColor(CONFIG.baseColorA, CONFIG.baseColorB, p.hue);
      gg.addColorStop(0, hexWithAlpha(color, p.alpha));
      gg.addColorStop(0.45, hexWithAlpha(color, p.alpha * 0.35));
      gg.addColorStop(1, hexWithAlpha(CONFIG.bgColor, 0));
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step() {
    for (const p of particles) {
      p.vx += rand(-CONFIG.jitterStrength, CONFIG.jitterStrength);
      p.vy += rand(-CONFIG.jitterStrength, CONFIG.jitterStrength);

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx); }
      if (p.x > w - p.r) { p.x = w - p.r; p.vx = -Math.abs(p.vx); }
      if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy); }
      if (p.y > h - p.r) { p.y = h - p.r; p.vy = -Math.abs(p.vy); }

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const minDist = 80;
        if (d2 < (minDist * minDist)) {
          const d = Math.sqrt(d2) || 0.0001;
          const push = (1 - (d / minDist)) * 0.9;
          p.vx += (dx / d) * push * 0.6;
          p.vy += (dy / d) * push * 0.6;
        }
      }

      p.vx *= 0.997;
      p.vy *= 0.997;

      const maxV = 2.4;
      if (p.vx > maxV) p.vx = maxV;
      if (p.vx < -maxV) p.vx = -maxV;
      if (p.vy > maxV) p.vy = maxV;
      if (p.vy < -maxV) p.vy = -maxV;

      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp < CONFIG.minSpeed) {
        const ang = Math.random() * Math.PI * 2;
        p.vx += Math.cos(ang) * (CONFIG.minSpeed * 0.6);
        p.vy += Math.sin(ang) * (CONFIG.minSpeed * 0.6);
      }
    }

    draw();
    animationId = window.requestAnimationFrame(step);
  }

  function hexWithAlpha(hex, alpha) {
    const h = hex.replace('#', '').trim();
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return `rgba(${r},${g},${b},${alpha})`;
    } else if (h.length === 6) {
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return `rgba(124,58,237,${alpha})`;
  }
  function interpolateColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
  }
  function hexToRgb(hex) {
    const h = hex.replace('#', '').trim();
    if (h.length === 3) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16)
      };
    } else {
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
      };
    }
  }
  function toHex(n) { return ('0' + n.toString(16)).slice(-2); }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    mouse.y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    mouse.active = true;
  }
  function onMouseLeave() {
    mouse.active = false;
    mouse.x = null; mouse.y = null;
  }

  function start() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      canvas.style.display = 'none';
      return;
    }
    dpr = Math.max(1, window.devicePixelRatio || 1);
    resize();
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window.__homeBgResize);
    window.__homeBgResize = setTimeout(resize, 120);
  });

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchmove', onMouseMove, { passive: true });
  canvas.addEventListener('mouseleave', onMouseLeave);
  canvas.addEventListener('touchend', onMouseLeave);

  requestAnimationFrame(start);

  window.__homeBg = { start, stop: () => { if (animationId) cancelAnimationFrame(animationId); animationId = null; } };
})();

// global state
let isMenuOpen = false;
let isPopupOpen = false;


// portfolio
const popup = document.querySelector(".portfolio-popup");
const popupImg = document.querySelector(".popup-img");
const popupTitle = document.querySelector(".popup-title");
const popupDesc = document.querySelector(".popup-desc");
const popupTech = document.querySelector(".popup-tech");
const popupLinks = document.querySelector(".popup-links");
const popupClose = document.querySelector(".popup-close");
// menu
const btnMenu = document.querySelector(".menu-btn");
const menuCont = document.querySelector(".menu-cont");
// data
const portfolioData = [
  {
    img: "img/portfolio/turbolance.webp",
    title: "Turbolance",
    desc: "Platform freelance modern dengan sistem project, auth, dashboard, dan UI premium.",
    tech: "HTML, CSS, JavaScript, Payment Gateway",
    links: "https://turbolance.vercel.app/"
  },
  {
    img: "img/portfolio/fashvibe.webp",
    title: "FashVibe Store",
    desc: "E-commerce fashion dengan cart, filter, search, serta tampilan minimalis clean.",
    tech: "HTML, CSS, JavaScript",
    links: "https://jfh11.github.io/mlweb/"
  },

  {
    img: "img/portfolio/luxoria.webp",
    title: "Luxoria | Landing Page",
    desc: "Luxury website landing page. Built with the modern, clean, and structured NextJS framework.",
    tech: "NextJS, TailwindCSS, TypeScript",
    links: "https://luxoria-landingpage.vercel.app/"
  },
];
// fungsi buka popup
function openPopup() {
  // jika menu terbuka → tutup
  if (isMenuOpen) {
    menuCont.style.visibility = "hidden";
    menuCont.style.opacity = "0";
    menuCont.style.transform = "scale(0.9)";
    isMenuOpen = false;
  }

  popup.classList.remove("hidden");
  popup.classList.add("active");
  isPopupOpen = true;
}

// fungsi tutup popup
function closePopup() {
  popup.classList.remove("active");
  isPopupOpen = false;

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 200);
}

popupClose.addEventListener("click", () => {
  closePopup();
});

// memanggil data portfolio
document.querySelectorAll(".portfolio-card button").forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    popupImg.src = portfolioData[index].img;
    popupTitle.textContent = portfolioData[index].title;
    popupDesc.textContent = portfolioData[index].desc;
    popupTech.textContent = portfolioData[index].tech;
    popupLinks.href = portfolioData[index].links;

    openPopup();
  });
});

// tutup popup
popupClose.addEventListener("click", (e) => {
  e.stopPropagation();
  closePopup();
});

// buka menu
btnMenu.addEventListener("click", (e) => {
  e.stopPropagation();

  // jika popup terbuka → tutup dulu
  if (isPopupOpen) closePopup();

  if (isMenuOpen) {
    menuCont.style.visibility = "hidden";
    menuCont.style.opacity = "0";
    menuCont.style.transform = "scale(0.9)";
    isMenuOpen = false;
  } else {
    menuCont.style.visibility = "visible";
    menuCont.style.opacity = "1";
    menuCont.style.transform = "scale(1)";
    isMenuOpen = true;
  }
});

// tutup menu
document.addEventListener("click", (e) => {
  const insideMenu = menuCont.contains(e.target) || btnMenu.contains(e.target);
  const insidePopup = popup.contains(e.target);

  if (!insideMenu && !insidePopup) {
    if (isMenuOpen) {
      menuCont.style.visibility = "hidden";
      menuCont.style.opacity = "0";
      menuCont.style.transform = "scale(0.9)";
      isMenuOpen = false;
    }

    if (isPopupOpen) {
      closePopup();
    }
  }
});

// stop propagation
menuCont.addEventListener("click", e => e.stopPropagation());
popup.addEventListener("click", e => e.stopPropagation());

// button download cv
document.getElementById("cv-download").addEventListener("click", function () {
  const link = document.createElement('a');
  link.href = "/files/CV-JUNNN.pdf";
  link.download = "CV-JUNNN.pdf";
  link.click();
});

// button github
document.querySelector(".home-btn").addEventListener("click", () => {
  window.open("https://github.com/Ranziroo", "_blank");
});
