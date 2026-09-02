const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.progress-dot')];
const heartField = document.querySelector('.heart-field');
const modal = document.querySelector('#memory-modal');
const modalCaption = document.querySelector('#modal-caption');
const toast = document.querySelector('#toast');
let currentStep = 0;
let songTimer = null;
let songStartedAt = 0;
let audioContext = null;

const heartSymbols = ['♥', '♡', '❤', '✦'];
for (let i = 0; i < 26; i += 1) {
  const heart = document.createElement('span');
  heart.className = `floating-heart ${i % 4 === 0 ? 'soft' : ''}`;
  heart.textContent = heartSymbols[i % heartSymbols.length];
  heart.style.setProperty('--left', `${(i * 37 + 5) % 102}%`);
  heart.style.setProperty('--top', `${(i * 47 + 2) % 102}%`);
  heart.style.setProperty('--size', `${9 + (i % 5) * 4}px`);
  heart.style.setProperty('--duration', `${4.5 + (i % 5) * 1.2}s`);
  heart.style.setProperty('--delay', `${-((i * 1.7) % 8)}s`);
  heart.style.setProperty('--rotate', `${-25 + (i % 6) * 10}deg`);
  heartField.appendChild(heart);
}

function goTo(step) {
  if (step < 0 || step >= screens.length) return;
  currentStep = step;
  screens.forEach((screen, index) => {
    const isActive = index === step;
    screen.classList.toggle('active', isActive);
    screen.setAttribute('aria-hidden', String(!isActive));
  });
  dots.forEach((dot, index) => dot.classList.toggle('active', index === step));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (step === 5) celebrate();
}

document.querySelectorAll('[data-next]').forEach((button) => {
  button.addEventListener('click', () => goTo(Number(button.dataset.next)));
});

document.querySelectorAll('.memory-card').forEach((card) => {
  card.addEventListener('click', () => {
    modalCaption.textContent = card.dataset.caption;
    modal.hidden = false;
  });
});

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', () => { modal.hidden = true; });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') modal.hidden = true;
});

const notYet = document.querySelector('#not-yet');
const notYetMessage = document.querySelector('#not-yet-message');
notYet.addEventListener('click', () => {
  notYetMessage.textContent = 'Okay, I’ll wait... but it’s a really good letter ♡';
  notYet.animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' },
  ], { duration: 300 });
});

document.querySelector('#open-letter').addEventListener('click', () => goTo(5));
document.querySelector('#replay').addEventListener('click', () => {
  stopSong();
  notYetMessage.textContent = '';
  goTo(0);
  showToast('Let’s do that again, birthday star ✦');
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function celebrate() {
  for (let i = 0; i < 32; i += 1) {
    const piece = document.createElement('span');
    const isHeart = i % 5 === 0;
    piece.className = `confetti ${isHeart ? 'heart' : ''}`;
    piece.textContent = isHeart ? '♥' : '';
    if (!isHeart) piece.style.background = ['#6ea4d7', '#f0a1b5', '#f7cd82', '#a6cfe0', '#918bd0'][i % 5];
    piece.style.left = `${4 + Math.random() * 92}%`;
    piece.style.setProperty('--fall', `${2.1 + Math.random() * 1.5}s`);
    piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 4100);
  }
}

function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

function playChime() {
  const context = getAudioContext();
  const now = context.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + index * .16);
    gain.gain.exponentialRampToValueAtTime(.07, now + index * .16 + .035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * .16 + .62);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + index * .16);
    oscillator.stop(now + index * .16 + .66);
  });
}

const playButton = document.querySelector('#play-song');
const trackFill = document.querySelector('#track-fill');
const trackTime = document.querySelector('#track-time');
function setTrackProgress(elapsed) {
  const duration = 32;
  const percentage = Math.min(100, (elapsed / duration) * 100);
  trackFill.style.width = `${percentage}%`;
  trackTime.textContent = `0:${String(Math.floor(elapsed)).padStart(2, '0')}`;
}
function stopSong() {
  window.clearInterval(songTimer);
  songTimer = null;
  playButton.classList.remove('playing');
  setTrackProgress(0);
}
playButton.addEventListener('click', () => {
  if (songTimer) {
    stopSong();
    return;
  }
  try { playChime(); } catch (error) { showToast('Your soundtrack is ready ✦'); }
  playButton.classList.add('playing');
  songStartedAt = Date.now();
  songTimer = window.setInterval(() => {
    const elapsed = (Date.now() - songStartedAt) / 1000;
    if (elapsed >= 32) stopSong(); else setTrackProgress(elapsed);
  }, 120);
});

const soundToggle = document.querySelector('#sound-toggle');
soundToggle.addEventListener('click', () => {
  const enabled = soundToggle.getAttribute('aria-pressed') === 'true';
  soundToggle.setAttribute('aria-pressed', String(!enabled));
  showToast(enabled ? 'Ambient sound off' : 'A little sparkle for you ✦');
  if (!enabled) {
    try { playChime(); } catch (error) { /* Audio may be unavailable until a gesture. */ }
  }
});

goTo(0);
