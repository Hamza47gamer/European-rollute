let balance = 10000
let timer = 10;
let interval;
let lastResults = [];
let isSpinning = false;
let patterns = [];
let usePatterns = false;
let currentSeed = 42;

// PRNG for generating numbers
function lcg(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    seed = (a * seed + c) % m;
    return seed / m;
}

// Generate result using patterns or randomness
function generateResult() {
    if (usePatterns && patterns.length > 0) {
        const basePattern = patterns[Math.floor(lcg(currentSeed) * patterns.length)];
        currentSeed = Math.floor(lcg(currentSeed) * 1000);
        const noise = Math.floor(lcg(currentSeed) * 3) - 1;
        let result = basePattern + noise;
        if (result < 0) result = 0;
        if (result > 36) result = 36;
        return result;
    } else {
        return Math.floor(lcg(currentSeed) * 37);
    }
}

// Create numbers on the roulette wheel
function createWheelNumbers() {
    const wheel = document.getElementById("wheel");
    const numbers = [
        { num: 0, color: "green" },
        { num: 32, color: "red" },
        { num: 15, color: "black" },
        { num: 19, color: "red" },
        { num: 4, color: "black" },
        { num: 21, color: "red" },
        // Add all 37 slots with appropriate numbers and colors
    ];
    const angleStep = 360 / numbers.length;

    numbers.forEach((n, i) => {
        const numberDiv = document.createElement("div");
        numberDiv.innerText = n.num;
        numberDiv.className = `number ${n.color}`;
        numberDiv.style.transform = `rotate(${i * angleStep}deg) translate(0, -140px)`;
        wheel.appendChild(numberDiv);
    });
}

// Timer logic
function startTimer() {
    interval = setInterval(() => {
        timer -= 1;
        document.getElementById("timer").innerText = timer;
        if (timer <= 0) {
            clearInterval(interval);
            document.getElementById("spin-button").disabled = false;
        }
    }, 1000);
}

// Spin the roulette wheel
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    document.getElementById("spin-button").disabled = true;

    const wheel = document.getElementById("wheel");
    const result = generateResult();
    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${3600 + result * (360 / 37)}deg)`;

    setTimeout(() => {
        updateLastResults(result);
        resetGame();
        isSpinning = false;
    }, 4000);
}

// Update last results
function updateLastResults(number) {
    lastResults.unshift(number);
    if (lastResults.length > 9) lastResults.pop();
    document.getElementById("last-results").innerText = lastResults.join(", ");
}

// Reset game
function resetGame() {
    timer = 15;
    document.getElementById("timer").innerText = timer;
    startTimer();
}

// Load patterns from localStorage
function loadPatterns() {
    const savedPatterns = localStorage.getItem("patterns");
    if (savedPatterns) {
        patterns = savedPatterns.split(",").map(Number);
        usePatterns = true;
    }
}

document.getElementById("spin-button").addEventListener("click", spinWheel);
window.onload = () => {
    loadPatterns();
    createWheelNumbers();
    startTimer();
};
