const API_BASE_URL = (window.KML_CONFIG?.API_BASE_URL || '').replace(/\/$/, '');
const API_FALLBACK_URL = (window.KML_CONFIG?.API_FALLBACK_URL || '').replace(/\/$/, '');
const modal = document.getElementById('booking-modal');
const openButton = document.getElementById('open-booking');
const closeButton = document.getElementById('close-booking');
const form = document.getElementById('booking-form');
const messageBox = document.getElementById('booking-message');
const availabilitySelect = document.getElementById('availability-select');
let currentLang = localStorage.getItem('kml_lang') || 'pt';

const translations = {
  pt: {
    tagline: 'Eficiência em transporte, superação em serviços para todo o Brasil.',
    headline: 'Envios e mudanças da Irlanda para o Brasil e Europa.',
    subheadline: 'Faça seu pedido de caixa, escolha uma data disponível e acompanhe a confirmação da coleta pela equipe KML.',
    benefit1: 'Coletas em toda a Irlanda, com agendamento prévio.',
    benefit2: 'Caixas equivalentes a malas de 32 kg, perfeitas para mudanças e encomendas.',
    benefit3: 'Mais de 15 anos atendendo brasileiros com comprometimento e transparência.',
    pricingTitle: 'Tamanhos de caixas e valores', boxLarge: 'Caixa grande', boxLargeEq: 'Equivalente a 3 malas de 32 kg.', boxMedium: 'Caixa média', boxMediumEq: 'Equivalente a 2 malas de 32 kg.', boxSmall: 'Caixa pequena', boxSmallEq: 'Equivalente a 1 mala de 32 kg.', noWeightLimit: 'Sem limite de peso por caixa.',
    ctaText: 'Agendar coleta', finePrint: 'Valores e prazos podem variar conforme a cidade de coleta e o destino final no Brasil ou Europa.',
    bookingTitle: 'Agendar coleta', bookingSubtitle: 'Preencha os dados. O pedido cai no painel da KML para confirmação.', sectionCustomer: '1. Seus dados', customerName: 'Nome completo *', email: 'E-mail *', whatsapp: 'WhatsApp com DDI *', pickupDate: 'Data disponível para coleta *', loadingDates: 'Carregando datas...', selectDate: 'Selecione uma data', noDates: 'Nenhuma data disponível no momento', errorDates: 'Erro ao carregar datas',
    sectionBox: '2. Caixa', boxSize: 'Tamanho da caixa *', selectLarge: 'Caixa grande · €380', selectMedium: 'Caixa média · €300', selectSmall: 'Caixa pequena · €230', quantity: 'Quantidade *', contents: 'O que vai dentro da caixa?', contentsPlaceholder: 'Ex.: roupas, impressora, ferramentas, cosméticos, livros...',
    sectionPickup: '3. Endereço de coleta na Irlanda', pickupAddress: 'Endereço *', addressPlaceholder: 'Rua, número, complemento principal', complement: 'Complemento', complementPlaceholder: 'Apartamento, bloco, referência', city: 'Cidade / Town *',
    sectionDestination: '4. Destino / destinatário', recipientName: 'Nome do destinatário *', recipientPhone: 'Telefone destino', destinationCountry: 'País destino *', destinationAddress: 'Endereço no destino *', destinationPlaceholder: 'Rua, número, bairro, complemento', destinationCity: 'Cidade destino *', state: 'Estado', notes: 'Observações', notesPlaceholder: 'Melhor horário, referência, instruções...', requiredText: 'Campos marcados com * são obrigatórios.', submitOrder: 'Enviar pedido', sending: 'Enviando...'
  },
  en: {
    tagline: 'Efficient transport and reliable service to Brazil.',
    headline: 'Shipping and moving from Ireland to Brazil and Europe.',
    subheadline: 'Request your box, choose an available pickup date and wait for KML confirmation.',
    benefit1: 'Pickups across Ireland by appointment.',
    benefit2: 'Boxes equivalent to 32 kg suitcases, ideal for moving and parcels.',
    benefit3: 'Over 15 years serving Brazilians with commitment and transparency.',
    pricingTitle: 'Box sizes and prices', boxLarge: 'Large box', boxLargeEq: 'Equivalent to 3 suitcases of 32 kg.', boxMedium: 'Medium box', boxMediumEq: 'Equivalent to 2 suitcases of 32 kg.', boxSmall: 'Small box', boxSmallEq: 'Equivalent to 1 suitcase of 32 kg.', noWeightLimit: 'No weight limit per box.',
    ctaText: 'Schedule pickup', finePrint: 'Prices and delivery times may vary according to pickup city and final destination in Brazil or Europe.',
    bookingTitle: 'Schedule pickup', bookingSubtitle: 'Fill in the details. Your request goes to the KML panel for confirmation.', sectionCustomer: '1. Your details', customerName: 'Full name *', email: 'Email *', whatsapp: 'WhatsApp with country code *', pickupDate: 'Available pickup date *', loadingDates: 'Loading dates...', selectDate: 'Select a date', noDates: 'No available dates right now', errorDates: 'Error loading dates',
    sectionBox: '2. Box', boxSize: 'Box size *', selectLarge: 'Large box · €380', selectMedium: 'Medium box · €300', selectSmall: 'Small box · €230', quantity: 'Quantity *', contents: 'What goes inside the box?', contentsPlaceholder: 'Ex.: clothes, printer, tools, cosmetics, books...',
    sectionPickup: '3. Pickup address in Ireland', pickupAddress: 'Address *', addressPlaceholder: 'Street, number, main complement', complement: 'Complement', complementPlaceholder: 'Apartment, block, reference', city: 'City / Town *',
    sectionDestination: '4. Destination / recipient', recipientName: 'Recipient name *', recipientPhone: 'Destination phone', destinationCountry: 'Destination country *', destinationAddress: 'Destination address *', destinationPlaceholder: 'Street, number, neighborhood, complement', destinationCity: 'Destination city *', state: 'State', notes: 'Notes', notesPlaceholder: 'Best time, reference, instructions...', requiredText: 'Fields marked with * are required.', submitOrder: 'Send request', sending: 'Sending...'
  }
};

function t(key) { return translations[currentLang][key] || translations.pt[key] || key; }

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('kml_lang', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('.lang-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
  if (availabilitySelect.dataset.loaded === 'true') loadAvailability();
}

function formatDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-IE', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function showMessage(text, type = 'ok') { messageBox.hidden = false; messageBox.textContent = text; messageBox.className = `form-message ${type}`; }
function hideMessage() { messageBox.hidden = true; messageBox.textContent = ''; }
function openModal() { modal.classList.add('is-visible'); modal.setAttribute('aria-hidden', 'false'); loadAvailability(); }
function closeModal() { modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden', 'true'); }

async function fetchFrom(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Erro ao falar com o servidor.');
  return data;
}

async function api(path, options = {}) {
  if (!API_BASE_URL || API_BASE_URL.includes('SEU-BACKEND')) throw new Error('Configure a URL do backend no arquivo config.js.');
  try {
    return await fetchFrom(API_BASE_URL, path, options);
  } catch (err) {
    if (API_FALLBACK_URL && API_FALLBACK_URL !== API_BASE_URL) {
      return await fetchFrom(API_FALLBACK_URL, path, options);
    }
    throw err;
  }
}

async function loadAvailability() {
  availabilitySelect.dataset.loaded = 'true';
  availabilitySelect.innerHTML = `<option value="">${t('loadingDates')}</option>`;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await api(`/api/availability?from=${today}`);
    const days = data.availability || [];
    if (!days.length) { availabilitySelect.innerHTML = `<option value="">${t('noDates')}</option>`; return; }
    availabilitySelect.innerHTML = `<option value="">${t('selectDate')}</option>`;
    days.forEach((day) => {
      const option = document.createElement('option');
      option.value = day.id;
      const route = day.routeName ? ` · ${day.routeName}` : '';
      const region = [day.city, day.county].filter(Boolean).join(' / ');
      const regionText = region ? ` · ${region}` : '';
      const time = day.startTime || day.endTime ? ` · ${day.startTime || ''}-${day.endTime || ''}` : '';
      option.textContent = `${formatDate(day.date)}${route}${regionText}${time} · ${day.remaining} vaga(s)`;
      availabilitySelect.appendChild(option);
    });
  } catch (err) {
    availabilitySelect.innerHTML = `<option value="">${t('errorDates')}</option>`;
    showMessage(err.message, 'error');
  }
}

function formToObject(formEl) {
  const obj = Object.fromEntries(new FormData(formEl).entries());
  Object.keys(obj).forEach((key) => { obj[key] = String(obj[key]).trim(); });
  obj.boxQuantity = Number(obj.boxQuantity || 1);
  obj.language = currentLang;
  return obj;
}

openButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
document.querySelectorAll('.lang-btn').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideMessage();
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = t('sending');
  try {
    const data = await api('/api/orders', { method: 'POST', body: JSON.stringify(formToObject(form)) });
    form.reset();
    showMessage(`${data.message} Código do pedido: ${data.order.code}`, 'ok');
    await loadAvailability();
  } catch (err) {
    showMessage(err.message, 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = t('submitOrder');
  }
});

applyLanguage(currentLang);
