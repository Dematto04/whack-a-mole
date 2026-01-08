const board = document.getElementById('board');

// Mobile HUD elements
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timeEl = document.getElementById('time');
const funMeter = document.getElementById('fun-meter');
const funLabel = document.getElementById('fun-label');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

// Desktop elements
const scoreElDesktop = document.getElementById('score-desktop');
const streakElDesktop = document.getElementById('streak-desktop');
const timeElDesktop = document.getElementById('time-desktop');
const funMeterDesktop = document.getElementById('fun-meter-desktop');
const funLabelDesktop = document.getElementById('fun-label-desktop');
const startBtnDesktop = document.getElementById('start-btn-desktop');
const stopBtnDesktop = document.getElementById('stop-btn-desktop');
const statusEl = document.getElementById('status');

const config = {
	roundTime: 30,
	initialUpTime: 1100,
	minimumUpTime: 520,
	holes: 8, // scattered garden layout
};

// Scattered positions for garden layout (percentage based) - optimized for mobile touch
const holePositions = [
	{ left: '5%', top: '8%' },
	{ left: '40%', top: '3%' },
	{ left: '75%', top: '10%' },
	{ left: '12%', top: '42%' },
	{ left: '55%', top: '38%' },
	{ left: '3%', top: '72%' },
	{ left: '38%', top: '68%' },
	{ left: '70%', top: '70%' },
];

const starColors = ['#FFE066', '#FF6B9D', '#98FF98', '#7DD3FC', '#E6E6FA'];

const state = {
	score: 0,
	streak: 0,
	timeLeft: config.roundTime,
	activeIndex: null,
	upTime: config.initialUpTime,
	playing: false,
};

const timers = {
	countdown: null,
	spawn: null,
	moleUp: null,
};

const celebratoryLines = [
	'Nice whack!',
	'Lightning reflexes!',
	'You caught it!',
	'Mole mission success!',
	'Rapid tapper!',
];

const holes = [];

function createHole(index) {
	const pos = holePositions[index];
	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'hole w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-amber-950 hover:border-amber-500 hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-amber-400 cursor-pointer shadow-clay-sm';
	button.style.left = pos.left;
	button.style.top = pos.top;
	button.setAttribute('aria-label', `Hole ${index + 1}`);
	button.setAttribute('aria-pressed', 'false');

	// Dark dirt hole interior
	const pit = document.createElement('div');
	pit.className = 'absolute inset-2 rounded-full bg-gradient-to-b from-amber-950 to-stone-950 border-4 border-stone-900 shadow-inner';

	// Dirt rim highlight
	const rim = document.createElement('div');
	rim.className = 'absolute inset-1 rounded-full border-4 border-amber-600/20 pointer-events-none';

	// Mole character
	const mole = document.createElement('div');
	mole.className = 'mole';

	const face = document.createElement('div');
	face.className = 'mole-face';

	const eyes = document.createElement('div');
	eyes.className = 'mole-eyes';
	const leftEye = document.createElement('div');
	leftEye.className = 'mole-eye';
	const rightEye = document.createElement('div');
	rightEye.className = 'mole-eye';

	const nose = document.createElement('div');
	nose.className = 'mole-nose';

	const cheeks = document.createElement('div');
	cheeks.className = 'mole-cheeks';
	const leftCheek = document.createElement('div');
	leftCheek.className = 'mole-cheek';
	const rightCheek = document.createElement('div');
	rightCheek.className = 'mole-cheek';

	eyes.append(leftEye, rightEye);
	cheeks.append(leftCheek, rightCheek);
	face.append(eyes, nose, cheeks);
	mole.append(face);

	button.append(pit, rim, mole);
	button.addEventListener('click', function () {
		handleWhack(index);
	});

	holes.push({ button, mole, face });
	board.appendChild(button);
}

// Create star burst effect
function createStarBurst(holeEl) {
	const burst = document.createElement('div');
	burst.className = 'star-burst';
	burst.style.top = '30%';
	burst.style.left = '50%';
	burst.style.transform = 'translate(-50%, -50%)';

	const starPositions = [
		{ tx: '-30px', ty: '-25px' },
		{ tx: '30px', ty: '-25px' },
		{ tx: '-40px', ty: '5px' },
		{ tx: '40px', ty: '5px' },
		{ tx: '0px', ty: '-35px' },
	];

	starPositions.forEach((pos, i) => {
		const star = document.createElement('div');
		star.className = 'star';
		star.style.setProperty('--tx', pos.tx);
		star.style.setProperty('--ty', pos.ty);
		star.innerHTML = `<svg viewBox="0 0 24 24" fill="${starColors[i % starColors.length]}"><polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9"/></svg>`;
		burst.appendChild(star);
	});

	holeEl.appendChild(burst);
	setTimeout(() => burst.remove(), 450);
}

// Create score popup
function createScorePopup(holeEl, points) {
	const popup = document.createElement('div');
	popup.className = 'score-popup';
	popup.textContent = `+${points}`;
	holeEl.appendChild(popup);
	setTimeout(() => popup.remove(), 550);
}

// Create dizzy spiral effect above mole's head
function createDizzySpiral(moleEl) {
	const spiral = document.createElement('div');
	spiral.className = 'dizzy-spiral';
	spiral.innerHTML = `
		<svg width="36" height="20" viewBox="0 0 36 20">
			<circle cx="8" cy="10" r="5" fill="#FFE066" stroke="#F59E0B" stroke-width="2"/>
			<circle cx="18" cy="6" r="4" fill="#FF6B9D" stroke="#E91E63" stroke-width="1.5"/>
			<circle cx="28" cy="10" r="5" fill="#98FF98" stroke="#22C55E" stroke-width="2"/>
		</svg>
	`;
	moleEl.appendChild(spiral);
	setTimeout(() => spiral.remove(), 450);
}

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
}

function updateFunMeter() {
	const width = Math.min(100, 30 + state.streak * 8);
	let label = 'Cool';
	if (state.streak >= 10) {
		label = 'On Fire!';
	} else if (state.streak >= 5) {
		label = 'Heating Up';
	} else if (state.streak >= 2) {
		label = 'Warming';
	}
	// Mobile
	if (funMeter) funMeter.style.width = `${width}%`;
	if (funLabel) funLabel.textContent = label;
	// Desktop
	if (funMeterDesktop) funMeterDesktop.style.width = `${width}%`;
	if (funLabelDesktop) funLabelDesktop.textContent = label;
}

function setStatus(message) {
	if (statusEl) statusEl.textContent = message;
}

function clearTimers() {
	clearInterval(timers.countdown);
	clearTimeout(timers.spawn);
	clearTimeout(timers.moleUp);
}

function hideActiveMole() {
	if (state.activeIndex === null) return;
	const activeHole = holes[state.activeIndex];
	activeHole.button.classList.remove('is-active');
	activeHole.button.setAttribute('aria-pressed', 'false');
	state.activeIndex = null;
}

function scheduleNextMole(delay = 420) {
	clearTimeout(timers.spawn);
	timers.spawn = setTimeout(spawnMole, delay);
}

function spawnMole() {
	if (!state.playing) return;
	hideActiveMole();
	const index = randomIndex(config.holes, state.activeIndex);
	state.activeIndex = index;
	const hole = holes[index];
	hole.button.classList.add('is-active');
	hole.button.setAttribute('aria-pressed', 'true');

	clearTimeout(timers.moleUp);
	timers.moleUp = setTimeout(function () {
		if (!state.playing) return;
		setStatus('Too slow! The mole hid.');
		state.streak = 0;
		updateFunMeter();
		hideActiveMole();
		scheduleNextMole(600);
	}, state.upTime);
}

function handleWhack(index) {
	if (!state.playing) return;
	if (state.activeIndex !== index) return;

	const hole = holes[index];

	// Play hit animation
	hole.button.classList.remove('is-active');
	hole.button.classList.add('is-hit');

	// Create visual effects
	createStarBurst(hole.button);
	createScorePopup(hole.button, 1);
	createDizzySpiral(hole.mole);

	// Remove hit class after animation
	setTimeout(() => {
		hole.button.classList.remove('is-hit');
	}, 450);

	state.score += 1;
	state.streak += 1;
	if (state.score % 5 === 0) {
		state.upTime = Math.max(config.minimumUpTime, state.upTime - 80);
	}

	updateScoreboard();
	updateFunMeter();
	setStatus(celebratoryLines[Math.floor(Math.random() * celebratoryLines.length)]);

	hole.button.setAttribute('aria-pressed', 'false');
	state.activeIndex = null;
	clearTimeout(timers.moleUp);
	scheduleNextMole(350);
}

function startCountdown() {
	clearInterval(timers.countdown);
	timers.countdown = setInterval(function () {
		if (!state.playing) return;
		state.timeLeft -= 1;
		updateScoreboard();
		if (state.timeLeft <= 0) {
			stopGame('Time is up! Great run.');
		}
	}, 1000);
}

function startGame() {
	state.score = 0;
	state.streak = 0;
	state.timeLeft = config.roundTime;
	state.upTime = config.initialUpTime;
	state.playing = true;
	updateScoreboard();
	updateFunMeter();
	setStatus('Game on! Whack the moles.');
	// Disable start, enable stop on both
	if (startBtn) startBtn.disabled = true;
	if (stopBtn) stopBtn.disabled = false;
	if (startBtnDesktop) startBtnDesktop.disabled = true;
	if (stopBtnDesktop) stopBtnDesktop.disabled = false;
	startCountdown();
	scheduleNextMole(200);
}

function stopGame(reason = 'Game stopped.') {
	state.playing = false;
	clearTimers();
	hideActiveMole();
	setStatus(reason);
	// Enable start, disable stop on both
	if (startBtn) startBtn.disabled = false;
	if (stopBtn) stopBtn.disabled = true;
	if (startBtnDesktop) startBtnDesktop.disabled = false;
	if (stopBtnDesktop) stopBtnDesktop.disabled = true;
}

// Event listeners for both mobile and desktop buttons
if (startBtn) startBtn.addEventListener('click', startGame);
if (stopBtn) stopBtn.addEventListener('click', function () {
	if (!state.playing) return;
	stopGame('Paused. Ready when you are.');
});
if (startBtnDesktop) startBtnDesktop.addEventListener('click', startGame);
if (stopBtnDesktop) stopBtnDesktop.addEventListener('click', function () {
	if (!state.playing) return;
	stopGame('Paused. Ready when you are.');
});

buildBoard();
updateScoreboard();
updateFunMeter();
if (stopBtn) stopBtn.disabled = true;
if (stopBtnDesktop) stopBtnDesktop.disabled = true;
