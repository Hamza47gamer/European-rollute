
let balance = 1000;
let timer = 15;
let interval;
let lastResults = [];
let isSpinning = false;
let patterns = []; // Store patterns from admin panel
let usePatterns = false; // Toggle between patterns and random generation
let currentSeed = 42; // Seed for PRNG

// Linear Congruential Generator (LCG) for PRNG
function lcg(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    seed = (a * seed + c) % m;
    return seed / m;
}

// Generate next result based on training patterns
function generateResult() {
    if (usePatterns && patterns.length > 0) {
        // Adjust result using pattern influence
        const basePattern = patterns[Math.floor(lcg(currentSeed) * patterns.length)];
        currentSeed = Math.floor(lcg(currentSeed) * 1000); // Update seed for next PRNG
        const noise = Math.floor(lcg(currentSeed) * 3) - 1; // Add slight random deviation (-1, 0, 1)
        let result = basePattern + noise;
        if (result < 0) result = 0; // Ensure results are within bounds
        if (result > 36) result = 36;
        return result;
    } else {
        // Pure random generation if no patterns are available
        return Math.floor(lcg(currentSeed) * 37);
    }
}

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

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    document.getElementById("spin-button").disabled = true;

    const wheel = document.getElementById("wheel");
    const result = generateResult(); // Use the algorithm to get the result

    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${3600 + result * 9.73}deg)`;

    setTimeout(() => {
        updateLastResults(result);
        resetGame();
        isSpinning = false;
    }, 4000);
}

function updateLastResults(number) {
    lastResults.unshift(number);
    if (lastResults.length > 9) lastResults.pop();
    document.getElementById("last-results").innerText = lastResults.join(", ");
}

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

// Event Listeners
document.getElementById("spin-button").addEventListener("click", spinWheel);
window.onload = () => {
    loadPatterns();
    startTimer();
};
