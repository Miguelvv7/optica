const CA_STEPS = [
  {
    key: 'tipo',
    question: '¿Cómo notas tu pérdida auditiva?',
    options: ['Leve, solo en algunas situaciones', 'Moderada, me cuesta seguir conversaciones', 'Severa, oigo muy poco', 'No lo sé, necesito una audiometría'],
  },
  {
    key: 'estilo',
    question: '¿Qué estilo prefieres?',
    options: ['Discreto / prácticamente invisible', 'Detrás del oído (más autonomía de batería)', 'Sin preferencia, que me aconsejen'],
  },
  {
    key: 'presupuesto',
    question: '¿Qué presupuesto tienes en mente?',
    options: ['Económico', 'Gama media', 'Premium', 'Quiero lo mejor, sin límite'],
  },
];

let caStep = 0;
const caAnswers = {};

function caRenderStep() {
  const total = CA_STEPS.length + 1; // +1 for the contact step
  document.getElementById('ca-step-label').textContent = `Paso ${caStep + 1} de ${total}`;
  document.getElementById('ca-percent').textContent = Math.round((caStep / total) * 100) + '%';
  document.getElementById('ca-bar').style.width = Math.round((caStep / total) * 100) + '%';

  if (caStep < CA_STEPS.length) {
    document.getElementById('ca-question-card').classList.remove('hidden');
    document.getElementById('ca-contact-card').classList.add('hidden');

    const stepData = CA_STEPS[caStep];
    document.getElementById('ca-question').textContent = stepData.question;
    const optionsEl = document.getElementById('ca-options');
    optionsEl.innerHTML = '';
    stepData.options.forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left border-2 border-outline-v rounded-xl p-4 transition-all hover:border-sec focus:outline-none font-medium text-on-surf text-sm mb-3';
      btn.textContent = label;
      btn.addEventListener('click', () => caSelectOption(stepData.key, label));
      optionsEl.appendChild(btn);
    });

    const backBtn = document.getElementById('ca-back');
    if (backBtn) backBtn.classList.toggle('invisible', caStep === 0);
  } else {
    document.getElementById('ca-question-card').classList.add('hidden');
    document.getElementById('ca-contact-card').classList.remove('hidden');
    document.getElementById('ca-summary').innerHTML = `
      <li><strong>Tipo de pérdida:</strong> ${caAnswers.tipo}</li>
      <li><strong>Estilo preferido:</strong> ${caAnswers.estilo}</li>
      <li><strong>Presupuesto:</strong> ${caAnswers.presupuesto}</li>
    `;
  }
}

function caSelectOption(key, value) {
  caAnswers[key] = value;
  caStep++;
  caRenderStep();
}

function caGoBack() {
  if (caStep === 0) return;
  caStep--;
  caRenderStep();
}

function caSendWhatsApp() {
  const name = document.getElementById('ca-name').value.trim();
  const tel = document.getElementById('ca-tel').value.trim();

  if (!name) { showToast('Por favor escribe tu nombre.'); document.getElementById('ca-name').focus(); return; }
  if (!tel)  { showToast('Por favor escribe tu teléfono.'); document.getElementById('ca-tel').focus(); return; }

  let msg = `Hola, me llamo *${name}* y quiero información sobre un audífono.`;
  msg += `\n\n🎯 Tipo de pérdida: ${caAnswers.tipo}`;
  msg += `\n👂 Estilo preferido: ${caAnswers.estilo}`;
  msg += `\n💰 Presupuesto: ${caAnswers.presupuesto}`;
  msg += `\n\n📞 Mi teléfono: ${tel}`;
  msg += `\n\n¡Gracias!`;

  window.open('https://wa.me/34744731503?text=' + encodeURIComponent(msg), '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  caRenderStep();
  const backBtn = document.getElementById('ca-back');
  if (backBtn) backBtn.addEventListener('click', caGoBack);
  const backBtn2 = document.getElementById('ca-back-2');
  if (backBtn2) backBtn2.addEventListener('click', caGoBack);
  const waBtn = document.getElementById('ca-wa-btn');
  if (waBtn) waBtn.addEventListener('click', caSendWhatsApp);
});
