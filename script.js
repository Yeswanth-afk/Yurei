const toggleIcon = document.getElementById('toggle-icon');
const modeToggle = document.getElementById('mode-toggle');
const heroLogo = document.getElementById('hero-logo');
const chars = document.querySelectorAll('.hero-title-animation .char');
const heroTagline = document.querySelector('.hero-tagline');

// Prevent browser from auto-scrolling on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure initial hash is always #home
if (location.hash && location.hash !== '#home') {
  history.replaceState(null, null, '#home');
  window.scrollTo(0, 0);
}

// Load SVG icon into toggle button
function loadIcon(path) {
  fetch(path)
    .then(res => res.text())
    .then(svg => {
      toggleIcon.innerHTML = svg;
    });
}

// Set theme icon based on current mode
function setIcon() {
  const iconPath = document.body.classList.contains('light-mode')
    ? 'assets/icons/moon.svg'
    : 'assets/icons/sun.svg';
  loadIcon(iconPath);
}

// Load and animate hero logo based on current theme
function loadLogo() {
  const isLight = document.body.classList.contains('light-mode');
  const logoPath = isLight ? 'assets/logo_light.svg' : 'assets/logo.svg';

  fetch(logoPath)
    .then(res => res.text())
    .then(svgText => {
      heroLogo.innerHTML = svgText;

      const paths = heroLogo.querySelectorAll('#kitsune-logo path');

      paths.forEach(path => {
        const length = path.getTotalLength();
        path.setAttribute('stroke-dasharray', length);
        path.setAttribute('stroke-dashoffset', length);
        path.setAttribute('fill-opacity', 0);
      });

      const timeline = anime.timeline({
        easing: 'easeInOutSine',
        duration: 2000
      });

      timeline
        .add({
          targets: '#kitsune-logo path',
          strokeDashoffset: [anime.setDashoffset, 0],
          delay: anime.stagger(400)
        })
        .add({
          targets: '#kitsune-logo path',
          fillOpacity: [0, 1],
          duration: 1200,
          easing: 'easeOutQuad'
        }, '-=1000')
        .add({
          targets: '#kitsune-logo g',
          strokeWidth: 0,
          duration: 500,
          easing: 'easeOutQuad'
        }, '-=700');
    });
}

// Reset tagline style for animation
function resetTagline() {
  if (!heroTagline) return;
  heroTagline.style.opacity = 0;
  heroTagline.style.transform = 'translateY(10px)';
}

// Animate each character from Japanese to English
function animateChars() {
  chars.forEach((char, index) => {
    const jp = char.querySelector('.jp');
    const en = char.querySelector('.en');

    jp.style.opacity = 1;
    en.style.opacity = 0;

    anime({
      targets: jp,
      opacity: [1, 0],
      duration: 600,
      delay: index * 500,
      easing: 'easeInOutQuad'
    });

    anime({
      targets: en,
      opacity: [0, 1],
      duration: 600,
      delay: index * 500 + 300,
      easing: 'easeInOutQuad',
      complete: () => {
        if (index === chars.length - 1) {
          animateTagline();
        }
      }
    });
  });
}

// Animate tagline fade-in
function animateTagline() {
  if (!heroTagline) return;

  anime({
    targets: heroTagline,
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeInOutQuad'
  });
}

// Handle theme toggle button click
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  // Save preference
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }

  setIcon();
  loadLogo();

  resetTagline();
  animateChars();
  resetScrollButtonAnimation();
});

// Apply saved theme preference on load
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
} else if (savedTheme === 'dark') {
  document.body.classList.remove('light-mode');
}

// Initialize icon and logo
setIcon();
loadLogo();

// Animate title and tagline shortly after load
setTimeout(() => {
  resetTagline();
  animateChars();
}, 700);

// Navigation scroll highlight logic
const sections = Array.from(document.querySelectorAll("section")).filter(s => s.id !== "home");
const navLinks = document.querySelectorAll("#navbar nav a");

function onScroll() {
  let current = "";

  // Determine current section based on scroll position
  if (window.scrollY < 100) {
    current = "home";
  } else {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom > 150) {
        current = section.id;
      }
    });
  }

  // Highlight active nav link
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  // Update URL hash without scrolling
  if (current && window.location.hash !== `#${current}`) {
    history.replaceState(null, null, `#${current}`);
  }
}

window.addEventListener("scroll", onScroll);
window.addEventListener("load", onScroll);

// GSAP and ScrollTrigger setup for widget blocks
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const widgetBlocks = document.querySelectorAll('.widget-block');
const moreImages = [
  'assets/widgets/1.png', 'assets/widgets/2.png', 'assets/widgets/3.png',
  'assets/widgets/4.png', 'assets/widgets/5.png', 'assets/widgets/6.png',
  'assets/widgets/7.png', 'assets/widgets/8.png', 'assets/widgets/9.png',
];

// Typing effect for text
function typeText(element, text) {
  return gsap.to(element, {
    duration: 2,
    text: text,
    ease: "none",
    overwrite: "auto"
  });
}

// Responsive animation setup
ScrollTrigger.matchMedia({
  // Desktop (≥768px)
  "(min-width: 768px)": function () {
    widgetBlocks.forEach((block, i) => {
      const phone = block.querySelector('.phone.mockup');
      const description = block.querySelector('.description');
      const tags = block.querySelectorAll('.tag');
      const heading = block.querySelector('h2');
      const fullText = description.textContent.trim();

      description.textContent = '';

      if (block.dataset.index === "3") {
        // Special block with image swap and longer scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          }
        });

        tl.fromTo(phone, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0);
        tl.fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.3);
        tl.to(description, { duration: 2, text: fullText, ease: "none", overwrite: "auto" }, 0.8);

        tags.forEach((tag, index) => {
          tl.fromTo(tag, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2 + index * 0.3);
        });

        // Dynamically swap phone images based on scroll progress
        ScrollTrigger.create({
          trigger: block,
          start: "top top",
          end: "+=300%",
          scrub: true,
          onUpdate: self => {
            const swapStart = 0.2;
            if (self.progress >= swapStart) {
              const normalizedProgress = (self.progress - swapStart) / (1 - swapStart);
              const idx = Math.floor(normalizedProgress * (moreImages.length - 1));
              phone.style.backgroundImage = `url('${moreImages[idx]}')`;
            } else {
              phone.style.backgroundImage = `url('${moreImages[0]}')`;
            }
          }
        });

      } else {
        // Default animation for other blocks
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          }
        });

        tl.fromTo(phone, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0);
        tl.fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.3);
        tl.to(description, { duration: 2, text: fullText, ease: "none", overwrite: "auto" }, 0.8);

        tags.forEach((tag, index) => {
          tl.fromTo(tag, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2 + index * 0.3);
        });
      }
    });
  },

  // Mobile (<768px)
  "(max-width: 767px)": function () {
    const staggerDelay = 1.5;

    widgetBlocks.forEach((block, i) => {
      const phone = block.querySelector('.phone.mockup');
      const description = block.querySelector('.description');
      const tags = block.querySelectorAll('.tag');
      const heading = block.querySelector('h2');
      const fullText = description.dataset.fullText || description.textContent;

      description.textContent = fullText;

      gsap.set([phone, heading, description, ...tags], { opacity: 0, y: 30 });

      // Fade-in animation triggered when block enters view
      ScrollTrigger.create({
        trigger: block,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(phone, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.4)
            .to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.8)
            .to(description, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.8)
            .to(tags, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.1
            }, 0.7);
        },
        delay: i * staggerDelay
      });
    });

    ScrollTrigger.refresh();
  }
});

// Komponents section with GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const colors = ['X', 'Y', 'L', 'O', 'P'];
const descriptions = {
  X: "NeoMaterialX — A futuristic theme with a cyberpunk energy.",
  Y: "NeoMaterialY — Bright yellow glow for sunny clarity.",
  L: "NeoMaterialL — Lavender haze blending tech and tranquility.",
  O: "NeoMaterialO — Orange pulse channeling solar cores.",
  P: "NeoMaterialP — Cyberpunk pink with electric flair."
};

const prefixEl = document.querySelector('.komponents-prefix');
const suffixEl = document.querySelector('.komponents-suffix');
const descEl = document.getElementById('komponents-description');
const grid = document.getElementById('komponents-grid');
const tabletMockup = document.querySelector('.tablet.mockup');

// Preload all icons
const allIcons = {};
colors.forEach(color => {
  allIcons[color] = [];
  for (let i = 1; i <= 25; i++) {
    const img = document.createElement('img');
    img.src = `assets/komponents/${color}/${i}.png`;
    allIcons[color].push(img);
  }
});

// Update grid with selected color icons
function updateGrid(color) {
  grid.innerHTML = '';
  allIcons[color].forEach((img, i) => {
    const clone = img.cloneNode();
    setTimeout(() => clone.classList.add('show'), i * 40);
    grid.appendChild(clone);
  });
}

let current = -1;

// Scroll-triggered animation for komponents section
ScrollTrigger.create({
  trigger: "#komponents",
  start: "top top",
  end: "+=400%",
  scrub: 1,
  pin: true,
  onUpdate: self => {
    let progress = self.progress;
    let index = Math.floor(progress * colors.length);
    if (index >= colors.length) index = colors.length - 1;

    if (index !== current) {
      current = index;
      const color = colors[index];

      // Animate suffix update
      gsap.fromTo(suffixEl, 
        { scale: 0, rotation: -90, opacity: 0 }, 
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)", overwrite: true }
      );
      suffixEl.textContent = color;

      // Animate description typing
      gsap.to(descEl, {
        duration: 1.5,
        text: descriptions[color],
        ease: "none",
        overwrite: "auto"
      });

      updateGrid(color);
    }
  }
});

// Smooth scroll for anchor navigation
document.querySelector('a[href="#komponents"]').addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector('#komponents');
  const offsetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
});

// Wall Grid section with dynamic wallpapers and interaction
document.addEventListener("DOMContentLoaded", () => {
  const wallGrid = document.querySelector(".wall-grid");
  const wallpapers = 12;

  const infoData = [
    {
      title: "Autumn",
      desc: "Wade into a golden dreamscape where every falling leaf whispers peace, and the stream mirrors a world wrapped in warmth.",
      tags: ["#AutumnVibes", "#Serene", "#OrangeGlow", "#NatureEscape"]
    },
    {
      title: "Winter",
      desc: "Nestled in snow and silence, the village glows—its warm lights a heartbeat beneath the mountain twilight.",
      tags: ["#WinterVillage", "#TwilightSnow", "#CozyVibes", "#MountainScene"]
    },
    {
      title: "Summer",
      desc: "Breathe in sunlight and green—where winding roads meet painted skies and the countryside hums with quiet life.",
      tags: ["#SummerVibes", "#Countryside", "#SunlitFields", "#PeacefulDrive"]
    },
    {
      title: "Rain",
      desc: "Raindrops fade but warmth lingers—soft lights, wet streets, and a town whispering stories through glistening wood.",
      tags: ["#RainyNight", "#JapaneseTown", "#WarmGlow", "#Peaceful"]
    },
    {
      title: "Sakura",
      desc: "Petals drift through time in a village of bridges and blossoms—where the past and spring meet in gentle harmony.",
      tags: ["#SakuraSeason", "#Countryside", "#CherryBlossoms", "#Tranquil"]
    },
    {
      title: "Anime Original – Rainy Day",
      desc: "In a quiet storm of petals and rain, she waits — calm, distant, and painted in hues of green and crimson.",
      tags: ["#Melancholy", "#RainyDay", "#AnimeAesthetic", "#FlowerField"]
    },
    {
      title: "Anime Original – Cherry Alley",
      desc: "Beneath a canopy of falling sakura, time slows — her glance, her silence, a fleeting echo in a petal-lined alley.",
      tags: ["#CherryBlossom", "#StreetStyle", "#SakuraMood", "#AnimeGirl"]
    },
    {
      title: "Anime Original – Blossom Tree",
      desc: "Under a cherry blossom sky, she stands still—wrapped in silence, framed by fleeting petals and quiet reflections.",
      tags: ["#CherryBlossom", "#AnimeGirl", "#Stillness", "#SpringMood"]
    },
    {
      title: "Cyberpunk",
      desc: "Step into a rain-soaked neon hive where tech pulses through every wire and every shadow hides a secret.",
      tags: ["#Cyberpunk", "#NeonCity", "#RainyNights", "#FutureChaos"]
    },
    {
      title: "Tradition",
      desc: "A red gate stands eternal beneath galaxies and lantern-glow, where each step forward echoes ancient wonder.",
      tags: ["#ToriiGate", "#StarryNight", "#SpiritualPath", "#Mystical"]
    },
    {
      title: "Night Walk",
      desc: "Under the soft glow of moon and streetlight, solitude walks hand in hand with reflection on a quiet midnight road.",
      tags: ["#Moody", "#NightWalk", "#UrbanLoneliness", "#FullMoon"]
    },
    {
      title: "Evening Glow",
      desc: "Twilight paints the sky in whispers of lavender as lamplight and clouds dance on rain-slick streets.",
      tags: ["#Twilight", "#ToriiGate", "#SereneCity", "#PastelSky"]
    }
  ];

  // Create mockups
  for (let i = 1; i <= wallpapers; i++) {
    const mockup = document.createElement("div");
    mockup.classList.add("wall-mockup");
    mockup.dataset.index = i;

    const img = document.createElement("img");
    img.src = `assets/Mockups/${i}.png`;
    img.alt = `Wallpaper ${i}`;

    mockup.appendChild(img);
    wallGrid.appendChild(mockup);
  }

  const mockups = document.querySelectorAll(".wall-mockup");

  // Handle mockup click events
  mockups.forEach((mockup, index) => {
    mockup.addEventListener("click", () => {
      const active = document.querySelector(".wall-mockup.active");
      if (mockup.classList.contains("active")) return;

      // Remove existing overlay
      if (active) {
        mockups.forEach(m => {
          m.classList.remove("active");
          const overlay = m.querySelector(".info-overlay");
          if (overlay) overlay.remove();
        });
      }

      mockup.classList.add("active");

      const { title, desc, tags } = infoData[index % infoData.length];
      const overlay = document.createElement("div");
      overlay.classList.add("info-overlay");
      overlay.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="info-tags">
          ${tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
        <div class="collapse-btn">Collapse</div>
      `;

      mockup.appendChild(overlay);

      // Animate overlay entrance
      gsap.fromTo(overlay, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });

      overlay.querySelector(".collapse-btn").addEventListener("click", e => {
        e.stopPropagation();
        mockups.forEach(m => {
          m.classList.remove("active");
          const overlay = m.querySelector(".info-overlay");
          if (overlay) overlay.remove();
        });
      });
    });
  });

  // Reveal on scroll
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".wall-mockup", {
    scrollTrigger: {
      trigger: ".wall-grid",
      start: "top 85%",
      once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.25,
    ease: "power3.out"
  });
});

// Download section animation
const seal = document.getElementById('yurei-seal');
const btn = document.getElementById('download-btn');
const logoContainer = document.getElementById('logo-container');
const lore = document.querySelector('.lore');
const GITHUB_URL = 'https://github.com/yourusername/yurei/releases';

// Hover effect: Vibrate seal
btn.addEventListener('mouseenter', () => seal.classList.add('vibrate'));
btn.addEventListener('mouseleave', () => seal.classList.remove('vibrate'));

// Click effect: Burn, reveal logo, animate, redirect
btn.addEventListener('click', () => {
  btn.disabled = true;
  seal.classList.remove('vibrate');

  anime({
    targets: seal,
    scale: [1, 1.05, 0.98, 1],
    duration: 500,
    easing: 'easeInOutSine',
    complete: () => {
      seal.classList.add('burn');

      setTimeout(() => {
        seal.style.display = 'none';
        logoContainer.style.display = 'flex';

        loadDownloadLogo();
        startTypingEffect(
          "Yurei has awakened. Bound no longer, it now roams freely through code and circuit. You have summoned the unknown."
        );

        setTimeout(() => {
          window.location.href = GITHUB_URL;
        }, 2000);
      }, 800);
    }
  });
});

// Load and animate SVG logo
function loadDownloadLogo() {
  const isLight = document.body.classList.contains('light-mode');
  const logoPath = isLight ? 'assets/logo_light.svg' : 'assets/logo.svg';

  fetch(logoPath)
    .then(res => res.text())
    .then(svgText => {
      logoContainer.innerHTML = svgText;

      const paths = logoContainer.querySelectorAll('#kitsune-logo path');
      anime({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 800,
        delay: (el, i) => i * 50
      });
    });
}

// Lore typing animation
function startTypingEffect(text) {
  lore.innerHTML = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      lore.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 10);
    }
  }

  type();
}

// Force-reset URL hash on page load
window.addEventListener('load', () => {
  if (window.location.hash && window.location.hash !== '#home') {
    history.replaceState(null, null, '#home');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
});

// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileToggle = document.getElementById('mobile-mode-toggle');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// Dark/light mode toggle
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    localStorage.setItem(
      'theme',
      document.body.classList.contains('light-mode') ? 'light' : 'dark'
    );

    setIcon();
    loadLogo();
    resetTagline();
    animateChars();

    mobileMenu.classList.remove('active');
  });
}

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});

//Swipe-to-change image (only on mobile)
if (window.innerWidth < 768) {
  const moreBlock = document.querySelector('.widget-block[data-index="3"]');
  const phoneMockup = moreBlock?.querySelector('.phone.mockup');

  if (phoneMockup) {
    let currentIndex = 0;
    let startX = 0, startY = 0;
    let isSwiping = false;

    const updatePhoneImage = () => {
      phoneMockup.style.backgroundImage = `url('${moreImages[currentIndex]}')`;
    };

    updatePhoneImage();

    phoneMockup.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    });

    phoneMockup.addEventListener('touchmove', e => {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      if (!isSwiping && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isSwiping = true;
      }

      if (isSwiping) e.preventDefault();
    }, { passive: false });

    phoneMockup.addEventListener('touchend', e => {
      if (!isSwiping) return;

      const deltaX = e.changedTouches[0].clientX - startX;

      if (Math.abs(deltaX) > 40) {
        currentIndex = (deltaX < 0)
          ? (currentIndex + 1) % moreImages.length
          : (currentIndex - 1 + moreImages.length) % moreImages.length;

        updatePhoneImage();
      }

      startX = startY = 0;
      isSwiping = false;
    });
  }
}
