// Import game data (script must be loaded before this one)
// GAME_DATA is globally available from data.js

// ============================================
// Firebase Configuration
// ============================================
// TODO: Replace with your own Firebase config from https://console.firebase.google.com
// 1. Create a new Firebase project
// 2. Enable Realtime Database
// 3. Set database rules to allow read/write
// 4. Copy your config here
const firebaseConfig = {
  apiKey: "AIzaSyC4uwndKXWHrf5ussBayogJA1PgAEt4TaM",
  authDomain: "long-prj.firebaseapp.com",
  databaseURL:
    "https://long-prj-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "long-prj",
  storageBucket: "long-prj.firebasestorage.app",
  messagingSenderId: "286818965408",
  appId: "1:286818965408:web:46aa0dfdaa9ea4e91936c5",
};

// Initialize Firebase (with error handling)
let database = null;
let leaderboardRef = null;
let firebaseEnabled = false;

try {
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  leaderboardRef = database.ref("leaderboard");
  firebaseEnabled = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed:", error.message);
  console.warn("Leaderboard will be disabled. Please configure Firebase.");
}

// Current player
let currentPlayer = {
  name: null,
  id: null,
};

const board = document.getElementById("board");

// Mobile HUD elements
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const timeEl = document.getElementById("time");
const healthBar = document.getElementById("health-bar");
const healthLabel = document.getElementById("health-label");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

// Desktop elements
const scoreElDesktop = document.getElementById("score-desktop");
const streakElDesktop = document.getElementById("streak-desktop");
const timeElDesktop = document.getElementById("time-desktop");
const healthBarDesktop = document.getElementById("health-bar-desktop");
const healthLabelDesktop = document.getElementById("health-label-desktop");
const startBtnDesktop = document.getElementById("start-btn-desktop");
const stopBtnDesktop = document.getElementById("stop-btn-desktop");
const statusEl = document.getElementById("status");

// Username modal elements
const usernameModal = document.getElementById("username-modal");
const usernameInput = document.getElementById("username-input");
const usernameSubmitBtn = document.getElementById("username-submit-btn");
const usernameError = document.getElementById("username-error");
const currentPlayerMobile = document.getElementById("current-player-mobile");

// Leaderboard elements
const leaderboardPreview = document.getElementById("leaderboard-preview");
const leaderboardDesktop = document.getElementById("leaderboard-desktop");
const leaderboardMobile = document.getElementById("leaderboard-mobile");
const leaderboardModal = document.getElementById("leaderboard-modal");
const leaderboardBtnMobile = document.getElementById("leaderboard-btn-mobile");
const closeLeaderboardBtn = document.getElementById("close-leaderboard-btn");

// Toast container
let toastContainer = document.getElementById("toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.className =
    "fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none";
  document.body.appendChild(toastContainer);
}

const config = {
  roundTime: 60, // 60 seconds - represents transition period
  initialUpTime: 1200,
  minimumUpTime: 600,
  streakSpeedBonus: 50, // ms reduction per streak level
  holes: 8,
  scoring: {
    hitEnemy: 10,
    hitAlly: -20,
    missEnemy: -5,
    allyHealthPenalty: 15,
    quizCorrect: 5,
  },
  spawnRates: {
    enemyChance: 0.7, // 70% chance to spawn enemy
    allyChance: 0.3, // 30% chance to spawn ally
  },
};

// Scattered positions for construction site layout
const holePositions = [
  { left: "5%", top: "8%" },
  { left: "40%", top: "3%" },
  { left: "75%", top: "10%" },
  { left: "12%", top: "42%" },
  { left: "55%", top: "38%" },
  { left: "3%", top: "72%" },
  { left: "38%", top: "68%" },
  { left: "70%", top: "70%" },
];

// Game state
const state = {
  score: 0,
  streak: 0,
  health: 100, // Lòng dân (Public Trust)
  timeLeft: config.roundTime,
  activeIndex: null,
  activeEntity: null, // Current spawned entity
  upTime: config.initialUpTime,
  playing: false,
  quizActive: false, // Quiz popup is showing
  currentQuiz: null, // Current quiz question
  stats: {
    enemiesHit: 0,
    alliesHit: 0,
    enemiesMissed: 0,
  },
};

const timers = {
  countdown: null,
  spawn: null,
  entityUp: null,
};

// ============================================
// Entity System
// ============================================

class Entity {
  constructor(data, type) {
    this.id = data.id;
    this.label = data.label;
    this.description = data.description;
    this.color = data.color;
    this.icon = data.icon;
    this.weight = data.weight;
    this.quoteId = data.quoteId;
    this.type = type; // 'enemy' or 'ally'
  }

  isEnemy() {
    return this.type === "enemy";
  }

  isAlly() {
    return this.type === "ally";
  }

  getQuote() {
    return GAME_DATA.quotes[this.quoteId] || "";
  }
}

// Build entity pools with weights
function buildEntityPool(entities, type) {
  const pool = [];
  entities.forEach((data) => {
    // Add entity multiple times based on weight (weight 1.0 = 10 entries, 1.2 = 12, 0.8 = 8)
    const count = Math.round(data.weight * 10);
    for (let i = 0; i < count; i++) {
      pool.push(new Entity(data, type));
    }
  });
  return pool;
}

const enemyPool = buildEntityPool(GAME_DATA.entities.enemies, "enemy");
const allyPool = buildEntityPool(GAME_DATA.entities.allies, "ally");

function getRandomEntity() {
  const roll = Math.random();
  if (roll < config.spawnRates.enemyChance) {
    return enemyPool[Math.floor(Math.random() * enemyPool.length)];
  } else {
    return allyPool[Math.floor(Math.random() * allyPool.length)];
  }
}

const holes = [];

// ============================================
// UI Creation
// ============================================

function createHole(index) {
  const pos = holePositions[index];
  const button = document.createElement("button");
  button.type = "button";
  // Smaller on mobile (60px), medium on tablet (72px), larger on desktop (88px)
  button.className =
    "hole w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] lg:w-[88px] lg:h-[88px] rounded-full bg-gradient-to-b from-amber-700 to-amber-900 border-3 sm:border-4 border-amber-950 hover:border-amber-400 active:scale-95 sm:hover:scale-105 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-lg touch-manipulation";
  button.style.left = pos.left;
  button.style.top = pos.top;
  button.setAttribute("aria-label", `Vị trí ${index + 1}`);
  button.setAttribute("aria-pressed", "false");

  // Dark construction pit interior
  const pit = document.createElement("div");
  pit.className =
    "absolute inset-1.5 sm:inset-2 rounded-full bg-gradient-to-b from-amber-950 to-stone-950 border-2 sm:border-4 border-stone-900 shadow-inner";

  // Rim highlight
  const rim = document.createElement("div");
  rim.className =
    "absolute inset-1 rounded-full border-2 sm:border-4 border-amber-600/20 pointer-events-none";

  // Entity container
  const entityEl = document.createElement("div");
  entityEl.className = "entity";

  // Entity face/icon container
  const face = document.createElement("div");
  face.className = "entity-face";

  // Label badge
  const labelEl = document.createElement("div");
  labelEl.className = "entity-label";

  entityEl.append(face, labelEl);
  button.append(pit, rim, entityEl);

  button.addEventListener("click", function () {
    handleWhack(index);
  });

  holes.push({ button, entityEl, face, labelEl });
  board.appendChild(button);
}

// Create feedback effects
function createImpactEffect(holeEl, isPositive) {
  const burst = document.createElement("div");
  burst.className = "impact-burst";
  burst.style.top = "30%";
  burst.style.left = "50%";
  burst.style.transform = "translate(-50%, -50%)";

  const colors = isPositive
    ? ["#2E7D32", "#4CAF50", "#81C784", "#A5D6A7", "#C8E6C9"] // Green shades
    : ["#D32F2F", "#F44336", "#E57373", "#EF9A9A", "#FFCDD2"]; // Red shades

  const positions = [
    { tx: "-30px", ty: "-25px" },
    { tx: "30px", ty: "-25px" },
    { tx: "-40px", ty: "5px" },
    { tx: "40px", ty: "5px" },
    { tx: "0px", ty: "-35px" },
  ];

  positions.forEach((pos, i) => {
    const particle = document.createElement("div");
    particle.className = "impact-particle";
    particle.style.setProperty("--tx", pos.tx);
    particle.style.setProperty("--ty", pos.ty);
    particle.style.backgroundColor = colors[i % colors.length];
    burst.appendChild(particle);
  });

  holeEl.appendChild(burst);
  setTimeout(() => burst.remove(), 450);
}

function createScorePopup(holeEl, points) {
  const popup = document.createElement("div");
  popup.className = `score-popup ${points > 0 ? "positive" : "negative"}`;
  popup.textContent = points > 0 ? `+${points}` : `${points}`;
  holeEl.appendChild(popup);
  setTimeout(() => popup.remove(), 600);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const bgColor =
    type === "success"
      ? "bg-ally"
      : type === "error"
        ? "bg-enemy"
        : type === "warning"
          ? "bg-construction"
          : "bg-worker";

  toast.className = `px-4 py-2 rounded-xl ${bgColor} text-white font-heading font-bold text-sm shadow-lg transform transition-all duration-300 opacity-0 translate-y-2`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ============================================
// Game Board & Logic
// ============================================

function buildBoard() {
  for (let i = 0; i < config.holes; i += 1) {
    createHole(i);
  }
}

function randomIndex(max, exclude) {
  const candidates = [];
  for (let i = 0; i < max; i += 1) {
    if (i !== exclude) candidates.push(i);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function updateScoreboard() {
  // Mobile HUD
  if (scoreEl) scoreEl.textContent = state.score;
  if (streakEl) streakEl.textContent = state.streak;
  if (timeEl) timeEl.textContent = state.timeLeft;
  // Desktop
  if (scoreElDesktop) scoreElDesktop.textContent = state.score;
  if (streakElDesktop) streakElDesktop.textContent = state.streak;
  if (timeElDesktop) timeElDesktop.textContent = state.timeLeft;

  // Update streak visual effects
  updateStreakEffects();
}

// Streak rush visual effects
function updateStreakEffects() {
  const body = document.body;
  const streak = state.streak;

  // Remove all streak level classes
  body.classList.remove("streak-level-1", "streak-level-2", "streak-level-3");

  // Apply appropriate streak level based on current streak
  if (streak >= 10) {
    body.classList.add("streak-level-3"); // Maximum intensity
  } else if (streak >= 5) {
    body.classList.add("streak-level-2"); // Medium intensity
  } else if (streak >= 3) {
    body.classList.add("streak-level-1"); // Low intensity
  }

  // Update speed lines
  updateSpeedLines(streak);
}

// Dynamic speed lines based on streak
function updateSpeedLines(streak) {
  const container = document.getElementById("speed-lines");
  if (!container) return;

  // Clear existing lines if streak is low
  if (streak < 5) {
    container.innerHTML = "";
    return;
  }

  // Only regenerate if we don't have lines yet
  if (container.children.length === 0) {
    const lineCount = streak >= 10 ? 8 : 5;
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement("div");
      line.className = "speed-line";
      line.style.top = `${10 + Math.random() * 80}%`;
      line.style.width = `${30 + Math.random() * 40}%`;
      line.style.animationDelay = `${Math.random() * 0.8}s`;
      line.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      container.appendChild(line);
    }
  }
}

function updateHealthBar() {
  const healthPct = Math.max(0, Math.min(100, state.health));
  const width = `${healthPct}%`;

  // Determine color based on health level
  let colorClass = "from-ally to-gold"; // Green-gold for healthy
  if (healthPct <= 30) {
    colorClass = "from-enemy to-red-400"; // Red for critical
  } else if (healthPct <= 60) {
    colorClass = "from-construction to-amber-400"; // Orange for warning
  }

  // Mobile
  if (healthBar) {
    healthBar.style.width = width;
    healthBar.className = `h-full bg-gradient-to-r ${colorClass} transition-all duration-300 rounded-full`;
  }
  if (healthLabel) healthLabel.textContent = `${healthPct}%`;

  // Desktop
  if (healthBarDesktop) {
    healthBarDesktop.style.width = width;
    healthBarDesktop.className = `h-full bg-gradient-to-r ${colorClass} transition-all duration-300 rounded-full`;
  }
  if (healthLabelDesktop) healthLabelDesktop.textContent = `${healthPct}%`;
}

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function clearTimers() {
  clearInterval(timers.countdown);
  clearTimeout(timers.spawn);
  clearTimeout(timers.entityUp);
}

function hideActiveEntity() {
  if (state.activeIndex === null) return;
  const activeHole = holes[state.activeIndex];
  activeHole.button.classList.remove("is-active", "is-enemy", "is-ally");
  activeHole.button.setAttribute("aria-pressed", "false");
  activeHole.face.innerHTML = "";
  activeHole.labelEl.textContent = "";
  state.activeIndex = null;
  state.activeEntity = null;
}

function scheduleNextEntity(delay = 500) {
  clearTimeout(timers.spawn);
  timers.spawn = setTimeout(spawnEntity, delay);
}

function spawnEntity() {
  if (!state.playing) return;
  hideActiveEntity();

  const index = randomIndex(config.holes, state.activeIndex);
  const entity = getRandomEntity();

  state.activeIndex = index;
  state.activeEntity = entity;

  const hole = holes[index];

  // Apply entity styling
  hole.button.classList.add("is-active");
  hole.button.classList.add(entity.isEnemy() ? "is-enemy" : "is-ally");
  hole.button.setAttribute("aria-pressed", "true");
  hole.button.setAttribute(
    "aria-label",
    `${entity.label} - ${entity.isEnemy() ? "Đập!" : "Bảo vệ!"}`,
  );

  // Set entity appearance
  hole.face.innerHTML = entity.icon;
  hole.face.style.color = entity.color;
  hole.labelEl.textContent = entity.label;
  hole.labelEl.style.backgroundColor = entity.color;

  // Calculate upTime based on current streak (higher streak = faster entities)
  const currentUpTime = Math.max(
    config.minimumUpTime,
    config.initialUpTime - state.streak * config.streakSpeedBonus,
  );

  // Auto-hide timer (enemy miss = penalty)
  clearTimeout(timers.entityUp);
  timers.entityUp = setTimeout(function () {
    if (!state.playing) return;

    if (entity.isEnemy()) {
      // Missed an enemy - penalty!
      state.score = Math.max(0, state.score + config.scoring.missEnemy);
      state.streak = 0;
      state.stats.enemiesMissed++;

      const warnings = GAME_DATA.quotes.warning_decay;
      setStatus(warnings[Math.floor(Math.random() * warnings.length)]);
      showToast(`Bỏ lọt ${entity.label}!`, "warning");
      updateScoreboard();
    } else {
      // Ally escaped safely - good!
      setStatus(`${entity.label} an toàn!`);
    }

    hideActiveEntity();
    scheduleNextEntity(600);
  }, currentUpTime);
}

function handleWhack(index) {
  if (!state.playing) return;
  if (state.quizActive) return; // Don't allow whacks during quiz
  if (state.activeIndex !== index) return;
  if (!state.activeEntity) return;

  const hole = holes[index];
  const entity = state.activeEntity;

  // Clear auto-hide timer
  clearTimeout(timers.entityUp);

  // Play hit animation
  hole.button.classList.remove("is-active");
  hole.button.classList.add("is-hit");

  if (entity.isEnemy()) {
    // HIT ENEMY - GOOD!
    state.score += config.scoring.hitEnemy;
    state.streak += 1;
    state.stats.enemiesHit++;

    // Create positive effects
    createImpactEffect(hole.button, true);
    createScorePopup(hole.button, config.scoring.hitEnemy);

    // Feedback
    const successMsgs = GAME_DATA.quotes.success;
    setStatus(successMsgs[Math.floor(Math.random() * successMsgs.length)]);

    if (state.streak >= 5) {
      showToast(`Chuỗi ${state.streak}! Xuất sắc!`, "success");
    }
  } else {
    // HIT ALLY - Show quiz instead of immediate penalty
    createImpactEffect(hole.button, false);

    // Clear the hole visually
    setTimeout(() => {
      hole.button.classList.remove("is-hit", "is-enemy", "is-ally");
    }, 350);

    hole.button.setAttribute("aria-pressed", "false");
    state.activeIndex = null;
    state.activeEntity = null;
    hole.face.innerHTML = "";
    hole.labelEl.textContent = "";

    // Show quiz popup - penalty deferred to quiz result
    const question = getRandomQuizQuestion();
    showQuizModal(question);
    return; // Don't continue - quiz handles the rest
  }

  // Remove hit class after animation
  setTimeout(() => {
    hole.button.classList.remove("is-hit", "is-enemy", "is-ally");
  }, 350);

  updateScoreboard();
  updateHealthBar();

  hole.button.setAttribute("aria-pressed", "false");
  state.activeIndex = null;
  state.activeEntity = null;
  hole.face.innerHTML = "";
  hole.labelEl.textContent = "";

  scheduleNextEntity(400);
}

// ============================================
// Game Flow
// ============================================

function startCountdown() {
  clearInterval(timers.countdown);
  timers.countdown = setInterval(function () {
    if (!state.playing) return;
    state.timeLeft -= 1;
    updateScoreboard();
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function getEndGameMessage() {
  const { score, stats, health } = state;
  const totalHits = stats.enemiesHit + stats.alliesHit;
  const accuracy =
    totalHits > 0 ? Math.round((stats.enemiesHit / totalHits) * 100) : 0;

  let rating, messages;
  if (score >= 150 && accuracy >= 80 && health >= 50) {
    rating = "excellent";
    messages = GAME_DATA.quotes.game_over_excellent;
  } else if (score >= 80 && accuracy >= 60) {
    rating = "good";
    messages = GAME_DATA.quotes.game_over_good;
  } else {
    rating = "poor";
    messages = GAME_DATA.quotes.game_over_poor;
  }

  const message = messages[Math.floor(Math.random() * messages.length)];
  return `${message} (Điểm: ${score}, Độ chính xác: ${accuracy}%)`;
}

function endGame(reason = "time") {
  state.playing = false;
  clearTimers();
  hideActiveEntity();

  // Enable/disable buttons
  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (startBtnDesktop) startBtnDesktop.disabled = false;
  if (stopBtnDesktop) stopBtnDesktop.disabled = true;

  // Show end modal with results
  if (reason === "health") {
    setStatus("Lòng dân cạn kiệt! Nhiệm vụ thất bại.");
    showToast("Thất bại!", "error");
  } else {
    setStatus("Hết giờ! Xem kết quả.");
    showToast("Hết giờ!", "info");
  }

  // Submit score to Firebase
  submitScore();

  // Delay modal to let toast show
  setTimeout(showEndModal, 500);
}

function startGame() {
  // Reset state
  state.score = 0;
  state.streak = 0;
  state.health = 100;
  state.timeLeft = config.roundTime;
  state.upTime = config.initialUpTime;
  state.playing = true;
  state.quizActive = false;
  state.currentQuiz = null;
  state.stats = { enemiesHit: 0, alliesHit: 0, enemiesMissed: 0 };

  updateScoreboard();
  updateHealthBar();
  setStatus("Bắt đầu! Đập Giặc, Bảo vệ Động lực!");
  showToast("Nhiệm vụ bắt đầu!", "success");

  // Disable start, enable stop
  if (startBtn) startBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;
  if (startBtnDesktop) startBtnDesktop.disabled = true;
  if (stopBtnDesktop) stopBtnDesktop.disabled = false;

  startCountdown();
  scheduleNextEntity(500);
}

function stopGame(reason = "Tạm dừng. Sẵn sàng khi bạn muốn.") {
  state.playing = false;
  clearTimers();
  hideActiveEntity();
  setStatus(reason);

  // Clear streak visual effects
  document.body.classList.remove(
    "streak-level-1",
    "streak-level-2",
    "streak-level-3",
  );
  const speedLines = document.getElementById("speed-lines");
  if (speedLines) speedLines.innerHTML = "";

  // Enable start, disable stop
  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if (startBtnDesktop) startBtnDesktop.disabled = false;
  if (stopBtnDesktop) stopBtnDesktop.disabled = true;
}

// ============================================
// Modal System
// ============================================

const startModal = document.getElementById("start-modal");
const endModal = document.getElementById("end-modal");
const modalStartBtn = document.getElementById("modal-start-btn");
const modalReplayBtn = document.getElementById("modal-replay-btn");
const modalCloseBtn = document.getElementById("modal-close-btn");

// Quiz modal elements
const quizModal = document.getElementById("quiz-modal");
const quizQuestionEl = document.getElementById("quiz-question");
const quizOptionsEl = document.getElementById("quiz-options");
const quizFeedbackEl = document.getElementById("quiz-feedback");
const quizOptionBtns = quizOptionsEl
  ? quizOptionsEl.querySelectorAll(".quiz-option")
  : [];

function showModal(modalEl) {
  modalEl.classList.remove("opacity-0", "pointer-events-none");
  modalEl.classList.add("opacity-100");
  const content = modalEl.querySelector(".modal-content");
  if (content) {
    content.classList.remove("scale-95");
    content.classList.add("scale-100");
  }
}

function hideModal(modalEl) {
  modalEl.classList.add("opacity-0", "pointer-events-none");
  modalEl.classList.remove("opacity-100");
  const content = modalEl.querySelector(".modal-content");
  if (content) {
    content.classList.add("scale-95");
    content.classList.remove("scale-100");
  }
}

function populateStartModal() {
  const briefing = GAME_DATA.definitions.briefing;
  const enemies = GAME_DATA.entities.enemies;
  const allies = GAME_DATA.entities.allies;

  // Title and subtitle
  document.getElementById("briefing-title").textContent = briefing.title;
  document.getElementById("briefing-subtitle").textContent = briefing.subtitle;

  // Paragraphs
  const paragraphsEl = document.getElementById("briefing-paragraphs");
  paragraphsEl.innerHTML = briefing.paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");

  // Enemy legend
  const enemyLegend = document.getElementById("enemy-legend");
  enemyLegend.innerHTML = enemies
    .map(
      (e) => `
        <div class="flex items-center gap-2 text-sm">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-white" style="background-color: ${e.color}">
                ${e.icon.replace("viewBox", 'class="w-4 h-4" viewBox')}
            </span>
            <span class="font-semibold" style="color: ${e.color}">${e.label}</span>
            <span class="text-slate-500 text-xs">- ${e.description}</span>
        </div>
    `,
    )
    .join("");

  // Ally legend
  const allyLegend = document.getElementById("ally-legend");
  allyLegend.innerHTML = allies
    .map(
      (a) => `
        <div class="flex items-center gap-2 text-sm">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-white" style="background-color: ${a.color}">
                ${a.icon.replace("viewBox", 'class="w-4 h-4" viewBox')}
            </span>
            <span class="font-semibold" style="color: ${a.color}">${a.label}</span>
            <span class="text-slate-500 text-xs">- ${a.description}</span>
        </div>
    `,
    )
    .join("");

  // Rules
  const rulesEl = document.getElementById("briefing-rules");
  rulesEl.innerHTML = briefing.rules.map((r) => `<li>• ${r}</li>`).join("");
}

function showStartModal() {
  populateStartModal();
  showModal(startModal);
}

function populateEndModal() {
  const { score, stats, health } = state;
  const totalHits = stats.enemiesHit + stats.alliesHit;
  const accuracy =
    totalHits > 0 ? Math.round((stats.enemiesHit / totalHits) * 100) : 0;

  // Determine rating
  let rating;
  if (score >= 150 && accuracy >= 80 && health >= 50) {
    rating = "excellent";
  } else if (score >= 80 && accuracy >= 60) {
    rating = "good";
  } else {
    rating = "poor";
  }

  const debrief = GAME_DATA.definitions.debrief[rating];
  const header = document.getElementById("debrief-header");

  // Set header color based on rating
  if (rating === "excellent") {
    header.className =
      "px-6 py-5 text-white bg-gradient-to-r from-gold to-amber-600";
  } else if (rating === "good") {
    header.className =
      "px-6 py-5 text-white bg-gradient-to-r from-ally to-green-600";
  } else {
    header.className =
      "px-6 py-5 text-white bg-gradient-to-r from-worker to-blue-700";
  }

  // Populate content
  document.getElementById("debrief-icon").textContent = debrief.icon;
  document.getElementById("debrief-title").textContent = debrief.title;
  document.getElementById("debrief-message").textContent = debrief.message;
  document.getElementById("debrief-quote").textContent = debrief.quote;

  // Stats
  const totalScore = score + health; // Combined score for leaderboard
  document.getElementById("final-total-score").textContent = totalScore;
  document.getElementById("final-score").textContent = score;
  document.getElementById("final-accuracy").textContent = `${accuracy}%`;
  document.getElementById("final-enemies").textContent = stats.enemiesHit;
  document.getElementById("final-health").textContent = `${health}%`;
}

function showEndModal() {
  populateEndModal();
  showModal(endModal);
}

// ============================================
// Quiz System
// ============================================

function getRandomQuizQuestion() {
  const questions = GAME_DATA.quizQuestions;
  return questions[Math.floor(Math.random() * questions.length)];
}

function showQuizModal(question) {
  state.quizActive = true;
  state.currentQuiz = question;

  // Pause game timer
  clearInterval(timers.countdown);

  // Populate question
  if (quizQuestionEl) {
    quizQuestionEl.textContent = question.question;
  }

  // Populate options
  const labels = ["A", "B", "C", "D"];
  quizOptionBtns.forEach((btn, index) => {
    const optionText = btn.querySelector(".option-text");
    if (optionText) {
      optionText.textContent = question.options[index];
    }
    // Reset button state
    btn.disabled = false;
    btn.className =
      "quiz-option w-full py-3 px-4 text-left rounded-xl border-3 border-slate-200 bg-white hover:border-ally hover:bg-ally/5 transition-all duration-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ally";
  });

  // Hide feedback
  if (quizFeedbackEl) {
    quizFeedbackEl.classList.add("hidden");
    quizFeedbackEl.textContent = "";
  }

  showModal(quizModal);
}

function hideQuizModal() {
  hideModal(quizModal);
  state.quizActive = false;
  state.currentQuiz = null;

  // Resume game timer if still playing
  if (state.playing && state.timeLeft > 0) {
    startCountdown();
    scheduleNextEntity(600);
  }

  // Check for game over after quiz
  if (state.health <= 0) {
    endGame("health");
  } else if (state.timeLeft <= 0) {
    endGame("time");
  }
}

function handleQuizAnswer(selectedIndex) {
  if (!state.currentQuiz || !state.quizActive) return;

  const question = state.currentQuiz;
  const isCorrect = selectedIndex === question.correctIndex;

  // Disable all buttons
  quizOptionBtns.forEach((btn) => {
    btn.disabled = true;
  });

  // Highlight correct/incorrect
  quizOptionBtns.forEach((btn, index) => {
    if (index === question.correctIndex) {
      // Correct answer - always show green
      btn.className =
        "quiz-option w-full py-3 px-4 text-left rounded-xl border-3 border-ally bg-ally/20 font-medium text-ally";
    } else if (index === selectedIndex && !isCorrect) {
      // Selected wrong answer - show red
      btn.className =
        "quiz-option w-full py-3 px-4 text-left rounded-xl border-3 border-enemy bg-enemy/20 font-medium text-enemy";
    }
  });

  // Show feedback and apply scoring
  if (quizFeedbackEl) {
    quizFeedbackEl.classList.remove("hidden");

    if (isCorrect) {
      // Correct answer: +5 points, streak reset, no health penalty
      state.score += config.scoring.quizCorrect;
      state.streak = 0;

      quizFeedbackEl.className =
        "text-center py-3 px-4 rounded-xl font-semibold bg-ally/20 text-ally border-2 border-ally";
      quizFeedbackEl.innerHTML = `✓ Chính xác! <span class="text-lg font-bold">+${config.scoring.quizCorrect} điểm</span><br><span class="text-sm">Streak reset về 0</span>`;
      showToast(
        `+${config.scoring.quizCorrect} điểm! Hiểu biết tốt!`,
        "success",
      );
    } else {
      // Wrong answer: full penalty
      state.score = Math.max(0, state.score + config.scoring.hitAlly);
      state.health = Math.max(
        0,
        state.health - config.scoring.allyHealthPenalty,
      );
      state.streak = 0;
      state.stats.alliesHit++;

      quizFeedbackEl.className =
        "text-center py-3 px-4 rounded-xl font-semibold bg-enemy/20 text-enemy border-2 border-enemy";
      quizFeedbackEl.innerHTML = `✗ Sai rồi! <span class="text-lg font-bold">${config.scoring.hitAlly} điểm</span><br><span class="text-sm">-${config.scoring.allyHealthPenalty}% Lòng dân</span>`;
      showToast("Trả lời sai! Phải học hỏi thêm.", "error");
    }
  }

  updateScoreboard();
  updateHealthBar();

  // Close modal after delay
  setTimeout(hideQuizModal, 1500);
}

// Quiz option click handlers
quizOptionBtns.forEach((btn, index) => {
  btn.addEventListener("click", function () {
    handleQuizAnswer(index);
  });
});

// Modal event listeners
if (modalStartBtn) {
  modalStartBtn.addEventListener("click", function () {
    hideModal(startModal);
    startGame();
  });
}

if (modalReplayBtn) {
  modalReplayBtn.addEventListener("click", function () {
    hideModal(endModal);
    setTimeout(() => startGame(), 300);
  });
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", function () {
    hideModal(endModal);
  });
}

// Close modals on backdrop click
if (startModal) {
  startModal.addEventListener("click", function (e) {
    if (e.target === startModal) {
      hideModal(startModal);
    }
  });
}

if (endModal) {
  endModal.addEventListener("click", function (e) {
    if (e.target === endModal) {
      hideModal(endModal);
    }
  });
}

// ============================================
// Firebase & Leaderboard System
// ============================================

function calculateFinalScore() {
  // Final score = Điểm liêm chính + Lòng dân
  return state.score + state.health;
}

function submitScore() {
  if (!currentPlayer.name) return;
  if (!firebaseEnabled || !leaderboardRef) {
    console.warn("Firebase not available, score not saved");
    return;
  }

  const finalScore = calculateFinalScore();
  const timestamp = Date.now();

  const scoreData = {
    name: currentPlayer.name,
    score: finalScore,
    integrityScore: state.score,
    publicTrust: state.health,
    timestamp: timestamp,
    accuracy:
      state.stats.enemiesHit + state.stats.alliesHit > 0
        ? Math.round(
            (state.stats.enemiesHit /
              (state.stats.enemiesHit + state.stats.alliesHit)) *
              100,
          )
        : 0,
  };

  // Push new score to Firebase
  leaderboardRef
    .push(scoreData)
    .then(() => {
      console.log("Score submitted successfully!");
      showToast(`Đã lưu điểm: ${finalScore}`, "success");
    })
    .catch((error) => {
      console.error("Error submitting score:", error);
      showToast("Lỗi lưu điểm!", "error");
    });
}

function renderLeaderboard(container, scores, limit = 10) {
  if (!container) return;

  if (!scores || scores.length === 0) {
    container.innerHTML =
      '<div class="text-center text-slate-400 text-sm py-4">Chưa có dữ liệu</div>';
    return;
  }

  // Sort by score descending
  const sortedScores = [...scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  container.innerHTML = sortedScores
    .map((entry, index) => {
      const medal =
        index === 0
          ? "🥇"
          : index === 1
            ? "🥈"
            : index === 2
              ? "🥉"
              : `${index + 1}.`;
      const isCurrentPlayer = entry.name === currentPlayer.name;
      const highlightClass = isCurrentPlayer
        ? "bg-gold/20 border-gold/40"
        : "bg-slate-50 border-slate-200";

      return `
      <div class="flex items-center justify-between p-2 rounded-xl border-2 ${highlightClass} transition-all">
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold w-8">${medal}</span>
          <div>
            <p class="font-semibold text-slate-800 text-sm ${isCurrentPlayer ? "text-amber-700" : ""}">${escapeHtml(entry.name)}</p>
            <p class="text-xs text-slate-500">LC: ${entry.integrityScore} | LD: ${entry.publicTrust}%</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-heading font-bold text-revolution text-lg">${entry.score}</p>
        </div>
      </div>
    `;
    })
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function setupLeaderboardListener() {
  if (!firebaseEnabled || !leaderboardRef) {
    const notConfiguredMsg =
      '<div class="text-center text-slate-400 text-sm py-4">Firebase chưa được cấu hình</div>';
    if (leaderboardPreview) leaderboardPreview.innerHTML = notConfiguredMsg;
    if (leaderboardDesktop) leaderboardDesktop.innerHTML = notConfiguredMsg;
    if (leaderboardMobile) leaderboardMobile.innerHTML = notConfiguredMsg;
    return;
  }

  // Listen for realtime updates
  leaderboardRef
    .orderByChild("score")
    .limitToLast(50)
    .on(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        const scores = data ? Object.values(data) : [];

        // Update all leaderboard displays
        renderLeaderboard(leaderboardPreview, scores, 5);
        renderLeaderboard(leaderboardDesktop, scores, 10);
        renderLeaderboard(leaderboardMobile, scores, 20);
      },
      (error) => {
        console.error("Leaderboard error:", error);
        const errorMsg =
          '<div class="text-center text-enemy text-sm py-4">Lỗi kết nối Firebase</div>';
        if (leaderboardPreview) leaderboardPreview.innerHTML = errorMsg;
        if (leaderboardDesktop) leaderboardDesktop.innerHTML = errorMsg;
        if (leaderboardMobile) leaderboardMobile.innerHTML = errorMsg;
      },
    );
}

// Username Modal Functions
function showUsernameModal() {
  if (usernameModal) {
    usernameModal.classList.remove("opacity-0", "pointer-events-none");
    usernameModal.querySelector(".modal-content").classList.remove("scale-95");
  }
}

function hideUsernameModal() {
  if (usernameModal) {
    usernameModal.classList.add("opacity-0", "pointer-events-none");
    usernameModal.querySelector(".modal-content").classList.add("scale-95");
  }
}

function validateUsername(name) {
  return name && name.trim().length >= 2 && name.trim().length <= 20;
}

function setCurrentPlayer(name) {
  currentPlayer.name = name.trim();
  currentPlayer.id = Date.now().toString();

  // Update display
  if (currentPlayerMobile) {
    currentPlayerMobile.textContent = currentPlayer.name;
  }

  // Store in localStorage for persistence
  localStorage.setItem("whackamole_player", JSON.stringify(currentPlayer));
}

function loadSavedPlayer() {
  const saved = localStorage.getItem("whackamole_player");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.name) {
        currentPlayer = data;
        if (currentPlayerMobile) {
          currentPlayerMobile.textContent = currentPlayer.name;
        }
        return true;
      }
    } catch (e) {
      console.error("Error loading saved player:", e);
    }
  }
  return false;
}

// Leaderboard Modal Functions
function showLeaderboardModal() {
  if (leaderboardModal) {
    leaderboardModal.classList.remove("opacity-0", "pointer-events-none");
    leaderboardModal
      .querySelector(".modal-content")
      .classList.remove("scale-95");
  }
}

function hideLeaderboardModal() {
  if (leaderboardModal) {
    leaderboardModal.classList.add("opacity-0", "pointer-events-none");
    leaderboardModal.querySelector(".modal-content").classList.add("scale-95");
  }
}

// Username Modal Event Listeners
if (usernameSubmitBtn) {
  usernameSubmitBtn.addEventListener("click", function () {
    const name = usernameInput ? usernameInput.value : "";

    if (validateUsername(name)) {
      setCurrentPlayer(name);
      hideUsernameModal();
      usernameError?.classList.add("hidden");

      // Show start modal after username is set
      setTimeout(showStartModal, 300);
    } else {
      usernameError?.classList.remove("hidden");
      usernameInput?.focus();
    }
  });
}

if (usernameInput) {
  usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      usernameSubmitBtn?.click();
    }
  });
}

// Leaderboard button listeners
if (leaderboardBtnMobile) {
  leaderboardBtnMobile.addEventListener("click", showLeaderboardModal);
}

if (closeLeaderboardBtn) {
  closeLeaderboardBtn.addEventListener("click", hideLeaderboardModal);
}

if (leaderboardModal) {
  leaderboardModal.addEventListener("click", function (e) {
    if (e.target === leaderboardModal) {
      hideLeaderboardModal();
    }
  });
}

// ============================================
// Event Listeners
// ============================================

// Override start buttons to show modal first
if (startBtn)
  startBtn.addEventListener("click", function () {
    if (!state.playing) showStartModal();
  });
if (stopBtn)
  stopBtn.addEventListener("click", function () {
    if (!state.playing) return;
    stopGame("Tạm dừng. Nhấn Bắt đầu để tiếp tục.");
  });
if (startBtnDesktop)
  startBtnDesktop.addEventListener("click", function () {
    if (!state.playing) showStartModal();
  });
if (stopBtnDesktop)
  stopBtnDesktop.addEventListener("click", function () {
    if (!state.playing) return;
    stopGame("Tạm dừng. Nhấn Bắt đầu để tiếp tục.");
  });

// ============================================
// Initialize
// ============================================

buildBoard();
updateScoreboard();
updateHealthBar();
if (stopBtn) stopBtn.disabled = true;
if (stopBtnDesktop) stopBtnDesktop.disabled = true;

// Setup Firebase leaderboard listener
setupLeaderboardListener();

// Check for saved player or show username modal
if (loadSavedPlayer()) {
  // Player exists, show start modal
  setTimeout(showStartModal, 500);
} else {
  // New player, show username modal first
  setTimeout(showUsernameModal, 500);
}
