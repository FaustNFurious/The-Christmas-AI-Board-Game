/* 1. ANIMAZIONE NEVE SU CANVAS */
const canvas = document.getElementById('snow-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numFlakes = 60;
    const flakes = [];

    for (let i = 0; i < numFlakes; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1,
            d: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.7 + 0.3
        });
    }

    function drawSnow() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        for (let i = 0; i < numFlakes; i++) {
            const f = flakes[i];
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        updateSnow();
    }

    function updateSnow() {
        for (let i = 0; i < numFlakes; i++) {
            const f = flakes[i];
            f.y += f.d;
            f.x += Math.sin(f.y * 0.01) * 0.5;
            if (f.y > height) {
                flakes[i] = { x: Math.random() * width, y: 0, r: f.r, d: f.d, opacity: f.opacity };
            }
        }
    }

    function animateSnow() {
        drawSnow();
        requestAnimationFrame(animateSnow);
    }
    animateSnow();
}

/* 2. LOGICA TIMER SIMULATO */
let timerInterval = null;
let totalSeconds = 180; // 3 minuti
let isRunning = false;
const timerMusic = document.getElementById('timer-music');
const musicStatus = document.getElementById('music-status');

function setMusicStatus(message, isError = false) {
    if (!musicStatus) return;
    musicStatus.innerText = message;
    musicStatus.className = `text-xs mt-5 ${isError ? 'text-red-400' : 'text-slate-400'}`;
}

function playTimerMusic() {
    if (!timerMusic) return;

    timerMusic.play().then(() => {
        setMusicStatus('Musica in riproduzione.');
    }).catch(() => {
        setMusicStatus('Impossibile riprodurre la musica: verifica che Media/Jingle Natalizio.mp3 esista.', true);
    });
}

function stopTimerMusic(reset = false) {
    if (!timerMusic) return;
    timerMusic.pause();
    if (reset) timerMusic.currentTime = 0;
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (display) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        display.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function toggleTimer() {
    const btnText = document.getElementById('btn-timer-text');
    const statusText = document.getElementById('timer-status');

    if (!isRunning) {
        isRunning = true;
        playTimerMusic();
        if (btnText) btnText.innerText = "Pausa";
        if (statusText) {
            statusText.innerText = "⏱️ Il tempo scorre! Assembla i giocattoli!";
            statusText.className = "text-sm font-semibold text-yellow-400 mb-6 animate-pulse";
        }

        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                stopTimerMusic(true);
                setMusicStatus('Musica ferma.');
                if (btnText) btnText.innerText = "Start Timer";
                if (statusText) {
                    statusText.innerText = "🔔 TEMPO SCADUTO! La slitta è partita!";
                    statusText.className = "text-sm font-bold text-red-500 mb-6";
                }
                playAlarmSound();
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        if (timerMusic) timerMusic.pause();
        setMusicStatus('Musica in pausa.');
        if (btnText) btnText.innerText = "Riprendi";
        if (statusText) {
            statusText.innerText = "Timer in pausa";
            statusText.className = "text-sm font-semibold text-slate-400 mb-6";
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    stopTimerMusic(true);
    setMusicStatus('La musica si avvia insieme al timer.');
    totalSeconds = 180;
    updateTimerDisplay();
    const btnText = document.getElementById('btn-timer-text');
    if (btnText) btnText.innerText = "Start Timer";
    const statusText = document.getElementById('timer-status');
    if (statusText) {
        statusText.innerText = "Pronto a iniziare? Clicca su Start!";
        statusText.className = "text-sm font-semibold text-slate-300 mb-6";
    }
}

// Sintesi audio campanella/sveglia natalizia con Web Audio API
function playAlarmSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    } catch(e) {
        console.log("Audio non supportato");
    }
}

/* 3. MODALE PREORDINE */
function openPreorderModal() {
    const modal = document.getElementById('preorder-modal');
    if (modal) modal.classList.remove('hidden');
}

function closePreorderModal() {
    const modal = document.getElementById('preorder-modal');
    if (modal) modal.classList.add('hidden');
}

function handlePreorderSubmit(e) {
    e.preventDefault();
    alert("🎄 Grazie per aver effettuato il preordine! Il tuo interesse è stato registrato per la sfida Aulab 2026!");
    closePreorderModal();
}

/* 4. ACCORDION REGOLAMENTO */
function toggleAccordion(id) {
    const el = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    if (el && icon) {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            el.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Esportiamo le funzioni globalmente per renderle accessibili agli attributi onclick nell'HTML
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.openPreorderModal = openPreorderModal;
window.closePreorderModal = closePreorderModal;
window.handlePreorderSubmit = handlePreorderSubmit;
window.toggleAccordion = toggleAccordion;

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');

function closeMobileMenu() {
    if (!mobileMenuToggle || !mobileMenu || !mobileMenuIcon) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Apri il menu di navigazione');
    mobileMenuIcon.classList.replace('fa-xmark', 'fa-tree');
}

if (mobileMenuToggle && mobileMenu && mobileMenuIcon) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMobileMenu();
            return;
        }

        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Chiudi il menu di navigazione');
        mobileMenuIcon.classList.replace('fa-tree', 'fa-xmark');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}