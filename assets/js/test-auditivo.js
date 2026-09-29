const TA_TONES = [
  { label: 'Tono grave', freq: 500 },
  { label: 'Tono medio-grave', freq: 1000 },
  { label: 'Tono medio-agudo', freq: 2000 },
  { label: 'Tono agudo', freq: 4000 },
  { label: 'Tono muy agudo', freq: 6000 },
];

let taCurrent = 0;
const taMisses = [];
let taAudioCtx = null;
let taPlaying = false;

function taPlayTone(freq, duration = 1300) {
  try {
    taAudioCtx = taAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (taAudioCtx.state === 'suspended') taAudioCtx.resume();
    const osc = taAudioCtx.createOscillator();
    const gain = taAudioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const now = taAudioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.linearRampToValueAtTime(0, now + duration / 1000);
    osc.connect(gain).connect(taAudioCtx.destination);
    osc.start(now);
    osc.stop(now + duration / 1000 + 0.05);
  } catch (e) { /* Web Audio unavailable */ }

  taPlaying = true;
  const ring = document.getElementById('quiz-ring');
  if (ring) ring.classList.add('ta-pinging');
  setTimeout(() => {
    taPlaying = false;
    if (ring) ring.classList.remove('ta-pinging');
  }, duration);
}

function taRenderStep() {
  const total = TA_TONES.length;
  document.getElementById('quiz-step-label').textContent = `Sonido ${taCurrent + 1} de ${total}`;
  const pct = Math.round((taCurrent / total) * 100);
  document.getElementById('quiz-percent').textContent = pct + '%';
  document.getElementById('quiz-bar').style.width = pct + '%';
  document.getElementById('quiz-tone-label').textContent = TA_TONES[taCurrent].label;

  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.classList.toggle('invisible', taCurrent === 0);

  // auto-play the tone once when the step appears
  setTimeout(() => taPlayTone(TA_TONES[taCurrent].freq), 350);
}

function taReplay() {
  if (taPlaying) return;
  taPlayTone(TA_TONES[taCurrent].freq);
}

function taAnswer(heard) {
  taMisses[taCurrent] = heard ? 0 : 1;
  taCurrent++;
  if (taCurrent < TA_TONES.length) {
    taRenderStep();
  } else {
    taRenderResult();
  }
}

function taGoBack() {
  if (taCurrent === 0) return;
  taCurrent--;
  taRenderStep();
}

function taRenderResult() {
  const missCount = taMisses.reduce((a, b) => a + b, 0);

  document.getElementById('quiz-card').classList.add('hidden');
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');

  let level, message, icon, colorClass;
  if (missCount === 0) {
    level = 'Audición dentro de lo normal';
    message = 'Has percibido bien los 5 tonos. Aun así, una revisión anual gratuita ayuda a detectar cualquier cambio a tiempo.';
    icon = 'check_circle';
    colorClass = 'text-green-500';
  } else if (missCount <= 2) {
    level = 'Posible pérdida auditiva leve';
    message = `No has percibido con claridad ${missCount} de los 5 tonos, sobre todo en frecuencias agudas — algo habitual en una pérdida leve. Te recomendamos una audiometría gratuita para salir de dudas.`;
    icon = 'info';
    colorClass = 'text-sec';
  } else {
    level = 'Recomendamos una audiometría cuanto antes';
    message = `No has percibido con claridad ${missCount} de los 5 tonos. Es un proceso rápido, indoloro y completamente gratuito, y te dará un diagnóstico mucho más preciso que este test.`;
    icon = 'priority_high';
    colorClass = 'text-amber-500';
  }

  setIcon(document.getElementById('quiz-result-icon'), icon);
  document.getElementById('quiz-result-icon').setAttribute('class', `ico text-5xl mb-4 block ${colorClass}`);
  document.getElementById('quiz-result-level').textContent = level;
  document.getElementById('quiz-result-message').textContent = message;
  document.getElementById('quiz-result-score').textContent = `Tonos no percibidos con claridad: ${missCount} / ${TA_TONES.length}`;

  const waMsg = `Hola, he hecho el test de audición online y mi resultado es: *${level}* (${missCount}/${TA_TONES.length} tonos no percibidos).\n\nMe gustaría pedir una audiometría gratuita.`;
  document.getElementById('quiz-wa-link').href = 'https://wa.me/34744731503?text=' + encodeURIComponent(waMsg);
}

function taRestart() {
  taCurrent = 0;
  taMisses.length = 0;
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-card').classList.remove('hidden');
  taRenderStep();
}

document.addEventListener('DOMContentLoaded', () => {
  taRenderStep();
  document.getElementById('quiz-ring').addEventListener('click', taReplay);
  document.getElementById('quiz-yes').addEventListener('click', () => taAnswer(true));
  document.getElementById('quiz-no').addEventListener('click', () => taAnswer(false));
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.addEventListener('click', taGoBack);
  const restartBtn = document.getElementById('quiz-restart');
  if (restartBtn) restartBtn.addEventListener('click', taRestart);
});
