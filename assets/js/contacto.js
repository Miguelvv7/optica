document.getElementById('contact-form').addEventListener('submit', function(e){
  e.preventDefault();
  const name    = document.getElementById('cf-name').value.trim();
  const tel     = document.getElementById('cf-tel').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const msg     = document.getElementById('cf-msg').value.trim();

  if(!name){ showToast('Por favor escribe tu nombre.'); document.getElementById('cf-name').focus(); return; }
  if(!tel){  showToast('Por favor escribe tu teléfono.'); document.getElementById('cf-tel').focus(); return; }
  if(!msg){  showToast('Por favor escribe tu mensaje.'); document.getElementById('cf-msg').focus(); return; }

  let text = `Hola, me llamo *${name}*.`;
  if(subject) text += `\n\n📋 Asunto: *${subject}*`;
  text += `\n\n💬 ${msg}`;
  text += `\n\n📞 Mi teléfono: ${tel}`;

  window.open('https://wa.me/34744731503?text=' + encodeURIComponent(text), '_blank');
});
