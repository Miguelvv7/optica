const TV_ROWS = [
  { size: 72, text: 'E F P' },
  { size: 56, text: 'T O Z' },
  { size: 44, text: 'L P E D' },
  { size: 34, text: 'P E C F D' },
  { size: 26, text: 'E D F C Z P' },
  { size: 18, text: 'F E L O P Z D' },
];

let tvStep = 0; // 0 = chart, 1 = astigmatism dial, 2 = near blur, then result
const tvData = { rowRead: null, dialClear: null, nearBlur: null };

function tvBuildDial() {
  const svg = document.getElementById('tv-dial-svg');
  const ns = 'http://www.w3.org/2000/svg';
  const lineCount = 24;
  for (let i = 0; i < lineCount; i++) {
    const angle = (Math.PI * 2 * i) / lineCount;
    const x2 = 100 + Math.cos(angle) * 92;
    const y2 = 100 + Math.sin(angle) * 92;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', '100');
    line.setAttribute('y1', '100');
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.setAttribute('class', 'tv-dial-line');
    svg.appendChild(line);
  }
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttribute('cx', '100');
  circle.setAttribute('cy', '100');
  circle.setAttribute('r', '4');
  circle.setAttribute('fill', '#1F8272');
  svg.appendChild(circle);
}

function tvRenderChart() {
  document.getElementById('quiz-step-label').textContent = 'Paso 1 de 3';
  document.getElementById('quiz-percent').textContent = '0%';
  document.getElementById('quiz-bar').style.width = '0%';
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.classList.add('invisible');

  const wrap = document.getElementById('tv-chart-rows');
  wrap.innerHTML = '';
  TV_ROWS.forEach((row, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tv-row w-full border-2 border-outline-v rounded-xl py-3 mb-2 font-display font-extrabold text-pri tracking-[.3em]';
    btn.style.fontSize = row.size + 'px';
    btn.textContent = row.text;
    btn.addEventListener('click', () => {
      tvData.rowRead = i;
      wrap.querySelectorAll('.tv-row').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      document.getElementById('tv-chart-next').disabled = false;
    });
    wrap.appendChild(btn);
  });

  document.getElementById('tv-step-chart').classList.remove('hidden');
  document.getElementById('tv-step-dial').classList.add('hidden');
  document.getElementById('tv-step-blur').classList.add('hidden');
}

function tvRenderDial() {
  document.getElementById('quiz-step-label').textContent = 'Paso 2 de 3';
  document.getElementById('quiz-percent').textContent = '33%';
  document.getElementById('quiz-bar').style.width = '33%';
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.classList.remove('invisible');

  document.getElementById('tv-step-chart').classList.add('hidden');
  document.getElementById('tv-step-dial').classList.remove('hidden');
  document.getElementById('tv-step-blur').classList.add('hidden');
}

function tvRenderBlur() {
  document.getElementById('quiz-step-label').textContent = 'Paso 3 de 3';
  document.getElementById('quiz-percent').textContent = '66%';
  document.getElementById('quiz-bar').style.width = '66%';
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.classList.remove('invisible');

  document.getElementById('tv-step-chart').classList.add('hidden');
  document.getElementById('tv-step-dial').classList.add('hidden');
  document.getElementById('tv-step-blur').classList.remove('hidden');
}

function tvGoBack() {
  if (tvStep === 0) return;
  tvStep--;
  if (tvStep === 0) tvRenderChart();
  else if (tvStep === 1) tvRenderDial();
}

function tvNext() {
  tvStep++;
  if (tvStep === 1) tvRenderDial();
  else if (tvStep === 2) tvRenderBlur();
  else tvRenderResult();
}

function tvAnswerDial(clear) {
  tvData.dialClear = clear;
  tvNext();
}

function tvAnswerBlur(blurry) {
  tvData.nearBlur = blurry;
  tvNext();
}

function tvRenderResult() {
  document.getElementById('quiz-percent').textContent = '100%';
  document.getElementById('quiz-bar').style.width = '100%';
  document.getElementById('quiz-card').classList.add('hidden');
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');

  const lowAcuity = tvData.rowRead !== null && tvData.rowRead <= 1; // only read the 2 biggest rows
  const flags = [];
  if (lowAcuity) flags.push('agudeza visual reducida');
  if (tvData.dialClear === false) flags.push('posibles señales de astigmatismo');
  if (tvData.nearBlur === true) flags.push('visión borrosa de cerca');

  let level, message, icon, colorClass;
  if (flags.length === 0) {
    level = 'Visión dentro de lo normal';
    message = 'No hemos detectado señales claras en este test rápido. Aun así, una revisión anual ayuda a detectar cualquier cambio a tiempo.';
    icon = 'check_circle';
    colorClass = 'text-green-500';
  } else if (flags.length === 1) {
    level = 'Podrías beneficiarte de una revisión';
    message = `Hemos detectado: ${flags[0]}. Te recomendamos un examen visual completo para confirmarlo y, si hace falta, graduar tu vista.`;
    icon = 'info';
    colorClass = 'text-sec';
  } else {
    level = 'Recomendamos una revisión visual cuanto antes';
    message = `Hemos detectado varias señales: ${flags.join(', ')}. Es un buen momento para una revisión completa, rápida e indolora.`;
    icon = 'priority_high';
    colorClass = 'text-amber-500';
  }

  setIcon(document.getElementById('quiz-result-icon'), icon);
  document.getElementById('quiz-result-icon').setAttribute('class', `ico text-5xl mb-4 block ${colorClass}`);
  document.getElementById('quiz-result-level').textContent = level;
  document.getElementById('quiz-result-message').textContent = message;
  document.getElementById('quiz-result-score').textContent = flags.length ? `Señales detectadas: ${flags.length}` : 'Sin señales detectadas';

  const waMsg = `Hola, he hecho el test de visión online y mi resultado es: *${level}*.\n\nMe gustaría pedir una revisión visual.`;
  document.getElementById('quiz-wa-link').href = 'https://wa.me/34744731503?text=' + encodeURIComponent(waMsg);
}

function tvRestart() {
  tvStep = 0;
  tvData.rowRead = null;
  tvData.dialClear = null;
  tvData.nearBlur = null;
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-card').classList.remove('hidden');
  document.getElementById('tv-chart-next').disabled = true;
  tvRenderChart();
}

document.addEventListener('DOMContentLoaded', () => {
  tvBuildDial();
  tvRenderChart();
  document.getElementById('tv-chart-next').addEventListener('click', tvNext);
  document.getElementById('tv-dial-yes').addEventListener('click', () => tvAnswerDial(true));
  document.getElementById('tv-dial-no').addEventListener('click', () => tvAnswerDial(false));
  document.getElementById('tv-blur-yes').addEventListener('click', () => tvAnswerBlur(true));
  document.getElementById('tv-blur-no').addEventListener('click', () => tvAnswerBlur(false));
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) backBtn.addEventListener('click', tvGoBack);
  const restartBtn = document.getElementById('quiz-restart');
  if (restartBtn) restartBtn.addEventListener('click', tvRestart);
});
