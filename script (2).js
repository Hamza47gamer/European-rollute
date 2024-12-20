let timer = 15;
let interval;
let isSpinning = false;
let balance = 1000;
let lastResults = [];
let customPatterns = [];
let currentSeed = 42;

// Initialize the betting table
function initializeBettingTable() {
    const bettingTable = document.getElementById('betting-table');
    for (let i = 0; i <= 36; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        if (i === 0) {
            div.className = 'green';
        } else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(i)) {
            div.className = 'red';
        } else {
            div.className = 'black';
        }
        bettingTable.appendChild(div);
    }
}

// Generate random number using PRNG
function prng(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    seed = (a * seed + c) % m;
    return seed / m;
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    const wheel = document.getElementById('wheel');
    const ball = document.getElementById('ball');
    const result = customPatterns.length ? customPatterns[Math.floor(prng(currentSeed) * customPatterns.length)] : Math.floor(prng(currentSeed) * 37);

    currentSeed = result;

    // Animate the wheel and ball
    wheel.style.transition = 'transform 4s ease-out';
    ball.style.transition = '4s linear';
    wheel.style.transform = `rotate(${360 * 10 + result * (360 / 37)}deg)`;

    setTimeout(() => {
        updateLastResults(result);
        resetGame();
        isSpinning = false;
    }, 4000);
}

// Update last results
function updateLastResults(result) {
    lastResults.unshift(result);
    if (lastResults.length > 9) lastResults.pop();
    document.getElementById('last-results').textContent = lastResults.join(', ');
}

// Timer logic
function startTimer() {
    timer = 15;
    interval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = `Time Left: ${timer}s`;
        if (timer <= 0) {
            clearInterval(interval);
            document.getElementById('spin-button').disabled = false;
        }
    }, 1000);
}

// Reset game
function resetGame() {
    timer = 15;
    startTimer();
}

// Save custom patterns
document.getElementById('save-patterns').addEventListener('click', () => {
    const input = document.getElementById('pattern-input').value;
    customPatterns = input.split(',').map(Number);
});

// Initialize the game
window.onload = () => {
    initializeBettingTable();
    startTimer();
    document.getElementById('spin-button').addEventListener('click', spinWheel);
};
