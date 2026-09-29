let selSvc = 'vision';

function selectSvc(svc) {
  selSvc = svc;
  document.getElementById('svc-vision').classList.toggle('sel', svc === 'vision');
  document.getElementById('svc-hearing').classList.toggle('sel', svc === 'hearing');
}

function openWhatsApp() {
  const name  = document.getElementById('f-name').value.trim();
  const tel   = document.getElementById('f-tel').value.trim();
  const time  = document.getElementById('f-time').value;
  const notes = document.getElementById('f-notes').value.trim();

  if (!name) { showToast('Por favor escribe tu nombre.'); document.getElementById('f-name').focus(); return; }
  if (!tel)  { showToast('Por favor escribe tu teléfono.'); document.getElementById('f-tel').focus(); return; }

  const svcLabel = selSvc === 'vision' ? 'Revisión Visual' : 'Revisión Auditiva';
  let msg = `Hola, me llamo *${name}* y me gustaría pedir una cita para una *${svcLabel}*.`;
  if (time) msg += `\n\n🕐 Prefiero venir: *${time}*.`;
  if (notes) msg += `\n\n📝 ${notes}`;
  msg += `\n\n📞 Mi teléfono: ${tel}`;
  msg += `\n\n¡Gracias!`;

  const url = 'https://wa.me/34744731503?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('svc') === 'hearing' ? 'hearing' : 'vision';
  selectSvc(preselect);
  document.getElementById('svc-vision').addEventListener('click', () => selectSvc('vision'));
  document.getElementById('svc-hearing').addEventListener('click', () => selectSvc('hearing'));
  document.getElementById('wa-btn').addEventListener('click', openWhatsApp);
});
