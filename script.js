// Theme Changer Logic (Button version)
const toggleLightDarkBtn = document.getElementById('toggle-light-dark');
const colorThemeBtn = document.getElementById('color-theme-btn');

function setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-color');
    document.body.classList.add('theme-' + theme);
    localStorage.setItem('stopwatch-theme', theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(currentTheme) {
    if (currentTheme === 'color') {
        toggleLightDarkBtn.textContent = 'Light/Dark';
        colorThemeBtn.disabled = true;
    } else {
        colorThemeBtn.disabled = false;
        if (currentTheme === 'light') {
            toggleLightDarkBtn.textContent = 'Dark';
        } else {
            toggleLightDarkBtn.textContent = 'Light';
        }
    }
}

toggleLightDarkBtn.addEventListener('click', function() {
    const current = document.body.classList.contains('theme-dark') ? 'dark' : (document.body.classList.contains('theme-light') ? 'light' : 'color');
    if (current === 'color') {
        setTheme('light');
    } else if (current === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

colorThemeBtn.addEventListener('click', function() {
    setTheme('color');
});

function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

const savedTheme = localStorage.getItem('stopwatch-theme');
const initialTheme = savedTheme || detectSystemTheme();
setTheme(initialTheme);
const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const hand = document.getElementById('hand');
const dial = document.getElementById('dial');
const statusText = document.getElementById('status-text');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

function updateDisplay() {
    const currentTime = Date.now();
    const timeToDisplay = elapsedTime + (isRunning ? (currentTime - startTime) : 0);
    
    timeDisplay.textContent = formatTime(timeToDisplay);
    
    // Update hand rotation
    // 60 seconds = 360 degrees
    // 1 second = 6 degrees
    // 1 ms = 0.006 degrees
    const rotation = (timeToDisplay % 60000) * 0.006;
    hand.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
}

function startTimer() {
    if (!isRunning) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 10); // Update frequently for smooth animation
        isRunning = true;
        statusText.textContent = "RUNNING";
        statusText.style.color = "#00ff88";
    }
}

function stopTimer() {
    if (isRunning) {
        elapsedTime += Date.now() - startTime;
        clearInterval(timerInterval);
        isRunning = false;
        statusText.textContent = "STOPPED";
        statusText.style.color = "#ff4444";
        updateDisplay();
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    timeDisplay.textContent = "00:00:00.00";
    hand.style.transform = `translateX(-50%) rotate(0deg)`;
    statusText.textContent = "READY";
    statusText.style.color = "#fff";
}

// Generate ticks and numbers
function createTicks() {
    const radius = 160; // Half of 320px
    
    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.classList.add('tick');
        
        if (i % 5 === 0) {
            tick.classList.add('major');
            
            // Create number
            const num = document.createElement('div');
            num.classList.add('tick-number');
            num.textContent = i < 10 ? `0${i}` : i;
            
            // Position number
            // We want the number to be inside the tick marks
            // Initial position is top center.
            // We rotate it around the center of the clock.
            
            // Using transform-origin in CSS handles the rotation around center.
            num.style.transform = `rotate(${i * 6}deg)`;
            
            // Note: The rotation rotates the element itself around the transform-origin.
            // If transform-origin is center of clock, rotating 90deg puts it at 3 o'clock.
            // The text inside will be rotated 90deg too.
            
            dial.appendChild(num);
        }
        
        tick.style.transform = `rotate(${i * 6}deg)`;
        dial.appendChild(tick);
    }
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize
createTicks();
resetTimer();
