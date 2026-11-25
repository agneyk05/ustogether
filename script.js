const PHOTOS = [
  {
    id: "jun-25",
    src: "assets/photos/IMG_20260625_231001047_Original.jpg",
    dateLabel: "25 JUN · 23:10",
    season: "summer",
    defaultCaption: "Late-night hours when we were still 'just friends' — already losing track of time."
  },
  {
    id: "jul-21",
    src: "assets/photos/IMG_0196.jpg",
    dateLabel: "21 JUL · 16:49",
    season: "summer",
    defaultCaption: "July afternoon together, easy smiles and effortless company."
  },
  {
    id: "jul-26",
    src: "assets/photos/IMG_0558.jpg",
    dateLabel: "26 JUL · 17:43",
    season: "summer",
    defaultCaption: "Golden-hour hangout that quietly meant more than we admitted."
  },
  {
    id: "aug-20",
    src: "assets/photos/IMG_2262.jpg",
    dateLabel: "20 AUG · 14:30",
    season: "summer",
    defaultCaption: "Getting closer every week—every plan felt like our favorite plan."
  },
  {
    id: "aug-21-a",
    src: "assets/photos/IMG_2812.jpg",
    dateLabel: "21 AUG · 14:11",
    season: "summer",
    defaultCaption: "August memories—laughing at things only the two of us understood."
  },
  {
    id: "aug-21-b",
    src: "assets/photos/IMG_2823.jpg",
    dateLabel: "21 AUG · 14:11",
    season: "summer",
    defaultCaption: "Right alongside each other, where everything started feeling different."
  },
  {
    id: "aug-22",
    src: "assets/photos/7c455417-68a9-4bdc-baf8-4206457d49b2.jpg",
    dateLabel: "22 AUG · 08:42",
    season: "summer",
    defaultCaption: "Morning light and another day we didn't want to end."
  },
  {
    id: "sep-10",
    src: "assets/photos/_DSC0089.jpg",
    dateLabel: "10 SEP · 11:08",
    season: "autumn",
    defaultCaption: "September frame—looking back, it was already so obvious."
  },
  {
    id: "sep-12",
    src: "assets/photos/IMG_5653.jpg",
    dateLabel: "12 SEP · 13:40",
    season: "autumn",
    defaultCaption: "Two days later, still finding every excuse to be together."
  },
  {
    id: "sep-13",
    src: "assets/photos/IMG_5953_Copy.jpg",
    dateLabel: "13 SEP · 14:09",
    season: "autumn",
    defaultCaption: "Sunday afternoon—closer than ever, right before everything changed."
  },
  {
    id: "nov-21-yes",
    src: "assets/photos/IMG_9248.jpg",
    dateLabel: "21 NOV · 10:01 AM",
    season: "nov21",
    special: true,
    defaultCaption: "21st November · 10:01 AM — The chat where I said yes to you. From here, we're together."
  },
  {
    id: "nov-21",
    src: "assets/photos/IMG_9160.jpg",
    dateLabel: "21 NOV · 23:06",
    season: "nov21",
    special: true,
    defaultCaption: "21st November · 11:06 PM — Committed, and out on our night ride."
  }
];

const CAPTION_STORAGE_KEY = "memory_site_captions_v1";
const NOTES_STORAGE_KEY = "memory_site_notes_v1";
const COMMITMENT_DATE = new Date("2026-11-21T10:01:00+05:30").getTime();

// ---- Live Counter ----
function updateCounter() {
  const now = Date.now();
  const diff = Math.max(0, now - COMMITMENT_DATE);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById("cnt-days").textContent = String(days).padStart(2, "0");
  document.getElementById("cnt-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cnt-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cnt-secs").textContent = String(secs).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

// ---- Saved Captions ----
function getSavedCaptions() {
  try {
    return JSON.parse(localStorage.getItem(CAPTION_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCaption(id, text) {
  const map = getSavedCaptions();
  map[id] = text.trim();
  localStorage.setItem(CAPTION_STORAGE_KEY, JSON.stringify(map));
}

function getCaption(photo) {
  const saved = getSavedCaptions();
  return saved[photo.id] || photo.defaultCaption;
}

// ---- Render Gallery ----
const galleryGrid = document.getElementById("gallery-grid");
let currentFilter = "all";

function renderGallery(filter = "all") {
  currentFilter = filter;
  const items = filter === "all" ? PHOTOS : PHOTOS.filter((p) => p.season === filter);
  galleryGrid.innerHTML = "";

  items.forEach((photo) => {
    const card = document.createElement("article");
    card.className = `memory-card${photo.special ? " is-special" : ""}`;

    const wrap = document.createElement("div");
    wrap.className = "memory-img-wrap";
    wrap.addEventListener("click", () => openLightbox(photo.id));

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = getCaption(photo);
    img.loading = "lazy";

    const badge = document.createElement("span");
    badge.className = "memory-badge";
    badge.textContent = photo.dateLabel;

    wrap.appendChild(img);
    wrap.appendChild(badge);

    const meta = document.createElement("div");
    meta.className = "memory-meta";

    const cap = document.createElement("p");
    cap.className = "memory-caption";
    cap.contentEditable = "true";
    cap.spellcheck = true;
    cap.textContent = getCaption(photo);
    cap.addEventListener("blur", () => {
      saveCaption(photo.id, cap.textContent || photo.defaultCaption);
      if (!cap.textContent.trim()) cap.textContent = photo.defaultCaption;
    });

    const hint = document.createElement("span");
    hint.className = "memory-hint";
    hint.textContent = "Click photo to zoom · Click text to edit caption";

    meta.appendChild(cap);
    meta.appendChild(hint);

    card.appendChild(wrap);
    card.appendChild(meta);
    galleryGrid.appendChild(card);
  });
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGallery(btn.dataset.filter);
  });
});

renderGallery("all");

// ---- Lightbox & Slideshow ----
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbDate = document.getElementById("lb-date");
const lbCaption = document.getElementById("lb-caption");
const lbCounter = document.getElementById("lb-counter");
const lbPlay = document.getElementById("lb-play");

let lbIndex = 0;
let autoplayTimer = null;

function getVisibleList() {
  return currentFilter === "all" ? PHOTOS : PHOTOS.filter((p) => p.season === currentFilter);
}

function showLightboxAt(index) {
  const list = getVisibleList();
  if (!list.length) return;
  lbIndex = (index + list.length) % list.length;
  const photo = list[lbIndex];
  lbImg.src = photo.src;
  lbImg.alt = getCaption(photo);
  lbDate.textContent = photo.dateLabel;
  lbCaption.textContent = getCaption(photo);
  lbCounter.textContent = `${lbIndex + 1} / ${list.length}`;
}

function openLightbox(photoId, startAutoplay = false) {
  const list = getVisibleList();
  const idx = Math.max(0, list.findIndex((p) => p.id === photoId));
  showLightboxAt(idx);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  if (startAutoplay) startAutoplayLoop();
}

function closeLightbox() {
  stopAutoplayLoop();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function startAutoplayLoop() {
  stopAutoplayLoop();
  lbPlay.textContent = "Pause";
  autoplayTimer = setInterval(() => showLightboxAt(lbIndex + 1), 3500);
}

function stopAutoplayLoop() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  lbPlay.textContent = "Autoplay";
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => showLightboxAt(lbIndex - 1));
document.getElementById("lb-next").addEventListener("click", () => showLightboxAt(lbIndex + 1));
lbPlay.addEventListener("click", () => {
  if (autoplayTimer) stopAutoplayLoop();
  else startAutoplayLoop();
});

document.getElementById("start-slideshow-btn").addEventListener("click", () => {
  openLightbox(getVisibleList()[0].id, true);
});

const timelineYesPreview = document.getElementById("timeline-yes-preview");
if (timelineYesPreview) {
  timelineYesPreview.addEventListener("click", () => openLightbox("nov-21-yes"));
}

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showLightboxAt(lbIndex - 1);
  if (e.key === "ArrowRight") showLightboxAt(lbIndex + 1);
});

// ---- Memory Jar Notes ----
const DEFAULT_NOTES = [
  {
    id: "seed-1",
    title: "How fast it felt natural",
    body: "We were friends for so long, yet the moment we got close it felt like we'd been waiting for it the whole time."
  },
  {
    id: "seed-2",
    title: "21st November · 11:06 PM",
    body: "Getting committed and heading straight out for a night ride—cool air, streetlights, and the happiest silence."
  }
];

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTES;
  } catch {
    return DEFAULT_NOTES;
  }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

const notesGrid = document.getElementById("notes-grid");
function renderNotes() {
  const notes = loadNotes();
  notesGrid.innerHTML = "";
  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";

    const h3 = document.createElement("h3");
    h3.textContent = note.title;

    const p = document.createElement("p");
    p.textContent = note.body;

    const del = document.createElement("button");
    del.className = "note-delete";
    del.type = "button";
    del.title = "Remove note";
    del.textContent = "×";
    del.addEventListener("click", () => {
      const updated = loadNotes().filter((n) => n.id !== note.id);
      saveNotes(updated);
      renderNotes();
    });

    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(del);
    notesGrid.appendChild(card);
  });
}
renderNotes();

document.getElementById("note-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const titleEl = document.getElementById("note-title");
  const bodyEl = document.getElementById("note-body");
  const notes = loadNotes();
  notes.unshift({
    id: "note-" + Date.now(),
    title: titleEl.value.trim(),
    body: bodyEl.value.trim()
  });
  saveNotes(notes);
  titleEl.value = "";
  bodyEl.value = "";
  renderNotes();
});

// ---- Soft Web Audio Night Vibe ----
let audioCtx = null;
let vibeGain = null;
let vibePlaying = false;

function toggleAmbient() {
  const btn = document.getElementById("ambient-toggle");
  const lbl = document.getElementById("ambient-label");

  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    vibeGain = audioCtx.createGain();
    vibeGain.gain.value = 0.0;
    vibeGain.connect(audioCtx.destination);

    // Warm midnight pad chord (Fmaj7 low voicing)
    [174.61, 220.0, 261.63, 329.63].forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 480;
      osc.connect(filter);
      filter.connect(vibeGain);
      osc.start();
    });
  }

  if (audioCtx.state === "suspended") audioCtx.resume();

  vibePlaying = !vibePlaying;
  vibeGain.gain.setTargetAtTime(vibePlaying ? 0.045 : 0.0, audioCtx.currentTime, 0.4);
  btn.setAttribute("aria-pressed", String(vibePlaying));
  lbl.textContent = vibePlaying ? "Night Vibe: On" : "Night Vibe: Off";
}

document.getElementById("ambient-toggle").addEventListener("click", toggleAmbient);

// ---- Night Sky & Sparkle Canvas ----
const canvas = document.getElementById("night-canvas");
const ctx = canvas.getContext("2d");
let stars = [];
let sparkles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 75 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,
    alpha: Math.random() * 0.6 + 0.2,
    drift: (Math.random() - 0.5) * 0.12
  }));
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function spawnSparkles() {
  const cx = window.innerWidth * 0.5;
  const cy = window.innerHeight * 0.65;
  for (let i = 0; i < 36; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.5 + 1.2;
    sparkles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1,
      color: Math.random() > 0.4 ? "#f5b971" : "#e899a8"
    });
  }
}

document.getElementById("sparkle-btn").addEventListener("click", spawnSparkles);

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    s.x += s.drift;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 232, 198, ${s.alpha})`;
    ctx.fill();
  });

  sparkles = sparkles.filter((p) => p.life > 0.02);
  sparkles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life *= 0.97;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ---- Scroll Reveal ----
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

