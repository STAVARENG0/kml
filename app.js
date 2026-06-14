const API_BASE_URL = (window.KML_CONFIG?.API_BASE_URL || '').replace(/\/$/, '');

const modal = document.getElementById('booking-modal');
const openButton = document.getElementById('open-booking');
const closeButton = document.getElementById('close-booking');
const form = document.getElementById('booking-form');
const messageBox = document.getElementById('booking-message');
const availabilitySelect = document.getElementById('availability-select');

function formatDatePt(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function showMessage(text, type = 'ok') {
  messageBox.hidden = false;
  messageBox.textContent = text;
  messageBox.className = `form-message ${type}`;
}

function hideMessage() {
  messageBox.hidden = true;
  messageBox.textContent = '';
}

function openModal() {
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  loadAvailability();
}

function closeModal() {
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
}

async function api(path, options = {}) {
  if (!API_BASE_URL || API_BASE_URL.includes('SEU-BACKEND')) {
    throw new Error('Configure a URL do backend no arquivo config.js.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao falar com o servidor.');
  }
  return data;
}

async function loadAvailability() {
  availabilitySelect.innerHTML = '<option value="">Carregando datas...</option>';
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await api(`/api/availability?from=${today}`);
    const days = data.availability || [];

    if (!days.length) {
      availabilitySelect.innerHTML = '<option value="">Nenhuma data disponível no momento</option>';
      return;
    }

    availabilitySelect.innerHTML = '<option value="">Selecione uma data</option>';
    days.forEach((day) => {
      const option = document.createElement('option');
      option.value = day.id;
      const route = day.routeName ? ` · ${day.routeName}` : '';
      const region = [day.city, day.county].filter(Boolean).join(' / ');
      const regionText = region ? ` · ${region}` : '';
      const time = day.startTime || day.endTime ? ` · ${day.startTime || ''}-${day.endTime || ''}` : '';
      option.textContent = `${formatDatePt(day.date)}${route}${regionText}${time} · ${day.remaining} vaga(s)`;
      availabilitySelect.appendChild(option);
    });
  } catch (err) {
    availabilitySelect.innerHTML = '<option value="">Erro ao carregar datas</option>';
    showMessage(err.message, 'error');
  }
}

function formToObject(formEl) {
  const formData = new FormData(formEl);
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = String(value).trim();
  });
  obj.boxQuantity = Number(obj.boxQuantity || 1);
  obj.language = 'pt';
  return obj;
}

openButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideMessage();
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Enviando...';

  try {
    const payload = formToObject(form);
    const data = await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    form.reset();
    showMessage(`${data.message} Código do pedido: ${data.order.code}`, 'ok');
    await loadAvailability();
  } catch (err) {
    showMessage(err.message, 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Enviar pedido';
  }
});
