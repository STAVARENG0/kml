const API_BASE_URL = (window.KML_CONFIG?.API_BASE_URL || '').replace(/\/$/, '');
const API_FALLBACK_URL = (window.KML_CONFIG?.API_FALLBACK_URL || '').replace(/\/$/, '');
const modal = document.getElementById('booking-modal');
const openButton = document.getElementById('open-booking');
const closeButton = document.getElementById('close-booking');
const form = document.getElementById('booking-form');
const messageBox = document.getElementById('booking-message');
const availabilitySelect = document.getElementById('availability-select');
const pickupInfoCheckbox = document.getElementById('pickup-info-at-collection');
const pickupInfoModeInput = document.getElementById('pickup-info-mode');
const acceptLegalCheckbox = document.getElementById('accept-legal');
let currentLang = localStorage.getItem('kml_lang') || 'pt';

const translations = {
  pt: {
    tagline: 'Eficiência em transporte, superação em serviços para todo o Brasil.',
    headline: 'Envios e mudanças da Irlanda para o Brasil e Europa.',
    subheadline: 'Faça seu pedido de caixa, escolha uma data disponível e acompanhe a confirmação da coleta pela equipe KML.',
    benefit1: 'Coletas em toda a Irlanda, com agendamento prévio.',
    benefit2: 'Caixas equivalentes a malas de 32 kg, perfeitas para mudanças e encomendas.',
    benefit3: 'Mais de 15 anos atendendo brasileiros com comprometimento e transparência.',
    pricingTitle: 'Tamanhos de caixas e valores',
    boxLarge: 'Caixa grande',
    boxLargeEq: 'Equivalente a 3 malas de 32 kg.',
    boxMedium: 'Caixa média',
    boxMediumEq: 'Equivalente a 2 malas de 32 kg.',
    boxSmall: 'Caixa pequena',
    boxSmallEq: 'Equivalente a 1 mala de 32 kg.',
    noWeightLimit: 'Sem limite de peso por caixa.',
    ctaText: 'Agendar coleta',
    instructionsCta: 'Instruções para preparar os itens',
    finePrint: 'Após enviar o pedido, a equipe KML entrará em contato para confirmar os dados e orientar a preparação dos itens para coleta.',
    privacyFooter: 'Privacidade',
    termsFooter: 'Termos',
    bookingTitle: 'Agendar coleta',
    bookingSubtitle: 'Preencha os dados. O pedido cai no painel da KML para confirmação.',
    sectionCustomer: '1. Seus dados',
    customerName: 'Nome completo *',
    email: 'E-mail *',
    whatsapp: 'WhatsApp com DDI *',
    pickupDate: 'Data disponível para coleta *',
    loadingDates: 'Carregando datas...',
    selectDate: 'Selecione uma data',
    noDates: 'Nenhuma data disponível no momento',
    errorDates: 'Erro ao carregar datas',
    sectionBox: '2. Caixa',
    boxSize: 'Tamanho da caixa *',
    selectLarge: 'Caixa grande · €380',
    selectMedium: 'Caixa média · €300',
    selectSmall: 'Caixa pequena · €230',
    quantity: 'Quantidade *',
    contents: 'O que vai dentro da caixa?',
    contentsPlaceholder: 'Ex.: roupas, impressora, ferramentas, cosméticos, livros...',
    sectionPickup: '3. Endereço de coleta na Irlanda',
    pickupAddress: 'Endereço *',
    addressPlaceholder: 'Rua, número, complemento principal',
    complement: 'Complemento',
    complementPlaceholder: 'Apartamento, bloco, referência',
    city: 'Cidade / Town *',
    sectionDestination: '4. Destino / destinatário',
    pickupInfoChoice: 'Prefiro informar conteúdo e dados do destino no momento da coleta.',
    pickupInfoHint: 'O funcionário da KML preencherá essas informações no painel de coletas.',
    recipientName: 'Nome do destinatário *',
    recipientPhone: 'Telefone destino',
    destinationCountry: 'País destino *',
    destinationAddress: 'Endereço no destino *',
    destinationPlaceholder: 'Rua, número, bairro, complemento',
    destinationCity: 'Cidade destino *',
    state: 'Estado',
    notes: 'Observações',
    notesPlaceholder: 'Melhor horário, referência, instruções...',
    acceptLegalStart: 'Li e aceito a',
    privacyLink: 'Política de Privacidade',
    acceptLegalAnd: 'e os',
    termsLink: 'Termos de Serviço',
    legalRequired: 'Você precisa aceitar a Política de Privacidade e os Termos de Serviço para enviar o pedido.',
    requiredText: 'Campos marcados com * são obrigatórios, exceto quando você escolher informar os dados no momento da coleta.',
    submitOrder: 'Enviar pedido',
    sending: 'Enviando...',
    successTitle: 'Pedido recebido com sucesso',
    successBody: 'Recebemos seu pedido. Em breve a equipe KML entrará em contato pelo WhatsApp para confirmar a coleta e passar as orientações finais.',
    successCode: 'Código do pedido:',
    instructionsButton: 'Ver instruções dos itens',
    closeMessage: 'Fechar'
  },
  en: {
    tagline: 'Efficient transport and reliable service to Brazil.',
    headline: 'Shipping and moving from Ireland to Brazil and Europe.',
    subheadline: 'Request your box, choose an available pickup date and wait for KML confirmation.',
    benefit1: 'Pickups across Ireland by appointment.',
    benefit2: 'Boxes equivalent to 32 kg suitcases, ideal for moving and parcels.',
    benefit3: 'Over 15 years serving Brazilians with commitment and transparency.',
    pricingTitle: 'Box sizes and prices',
    boxLarge: 'Large box',
    boxLargeEq: 'Equivalent to 3 suitcases of 32 kg.',
    boxMedium: 'Medium box',
    boxMediumEq: 'Equivalent to 2 suitcases of 32 kg.',
    boxSmall: 'Small box',
    boxSmallEq: 'Equivalent to 1 suitcase of 32 kg.',
    noWeightLimit: 'No weight limit per box.',
    ctaText: 'Schedule pickup',
    instructionsCta: 'Item preparation instructions',
    finePrint: 'After submitting your request, the KML team will contact you to confirm the details and guide item preparation for pickup.',
    privacyFooter: 'Privacy',
    termsFooter: 'Terms',
    bookingTitle: 'Schedule pickup',
    bookingSubtitle: 'Fill in the details. Your request goes to the KML panel for confirmation.',
    sectionCustomer: '1. Your details',
    customerName: 'Full name *',
    email: 'Email *',
    whatsapp: 'WhatsApp with country code *',
    pickupDate: 'Available pickup date *',
    loadingDates: 'Loading dates...',
    selectDate: 'Select a date',
    noDates: 'No available dates right now',
    errorDates: 'Error loading dates',
    sectionBox: '2. Box',
    boxSize: 'Box size *',
    selectLarge: 'Large box · €380',
    selectMedium: 'Medium box · €300',
    selectSmall: 'Small box · €230',
    quantity: 'Quantity *',
    contents: 'What goes inside the box?',
    contentsPlaceholder: 'Ex.: clothes, printer, tools, cosmetics, books...',
    sectionPickup: '3. Pickup address in Ireland',
    pickupAddress: 'Address *',
    addressPlaceholder: 'Street, number, main complement',
    complement: 'Complement',
    complementPlaceholder: 'Apartment, block, reference',
    city: 'City / Town *',
    sectionDestination: '4. Destination / recipient',
    pickupInfoChoice: 'I prefer to give content and destination details at pickup.',
    pickupInfoHint: 'The KML collector will fill these details in the collection panel.',
    recipientName: 'Recipient name *',
    recipientPhone: 'Destination phone',
    destinationCountry: 'Destination country *',
    destinationAddress: 'Destination address *',
    destinationPlaceholder: 'Street, number, neighborhood, complement',
    destinationCity: 'Destination city *',
    state: 'State',
    notes: 'Notes',
    notesPlaceholder: 'Best time, reference, instructions...',
    acceptLegalStart: 'I have read and accept the',
    privacyLink: 'Privacy Policy',
    acceptLegalAnd: 'and the',
    termsLink: 'Terms of Service',
    legalRequired: 'You must accept the Privacy Policy and Terms of Service to send the request.',
    requiredText: 'Fields marked with * are required unless you choose to provide destination details at pickup.',
    submitOrder: 'Send request',
    sending: 'Sending...',
    successTitle: 'Request received successfully',
    successBody: 'We have received your request. The KML team will contact you on WhatsApp soon to confirm the pickup and share the final instructions.',
    successCode: 'Order code:',
    instructionsButton: 'View item instructions',
    closeMessage: 'Close'
  }
};

function t(key) {
  return translations[currentLang][key] || translations.pt[key] || key;
}

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

function showSuccessCard(orderCode) {
  messageBox.hidden = false;
  messageBox.className = 'form-message ok success-card';
  messageBox.innerHTML = `
    <strong>${t('successTitle')}</strong>
    <p>${t('successBody')}</p>
    <p><b>${t('successCode')}</b> ${orderCode}</p>
    <div class="success-actions">
      <a href="instructions.html">${t('instructionsButton')}</a>
      <button type="button" id="close-success-message">${t('closeMessage')}</button>
    </div>
  `;
  const closeSuccess = document.getElementById('close-success-message');
  if (closeSuccess) closeSuccess.addEventListener('click', hideMessage);
}

function hideMessage() {
  messageBox.hidden = true;
  messageBox.textContent = '';
  messageBox.className = 'form-message';
}

function togglePickupInfoMode() {
  const atPickup = pickupInfoCheckbox.checked;
  pickupInfoModeInput.value = atPickup ? 'AT_PICKUP' : 'ONLINE';
  form.classList.toggle('pickup-mode-at-collection', atPickup);
  form.querySelectorAll('[data-required-online]').forEach((field) => {
    field.required = !atPickup;
  });
}

function openModal() {
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  hideMessage();
  togglePickupInfoMode();
  loadAvailability();
}

function closeModal() {
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
}

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
    if (!days.length) {
      availabilitySelect.innerHTML = `<option value="">${t('noDates')}</option>`;
      return;
    }
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
  obj.pickupInfoMode = pickupInfoModeInput.value;
  obj.acceptPrivacy = acceptLegalCheckbox.checked;
  obj.acceptTerms = acceptLegalCheckbox.checked;
  return obj;
}

openButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
document.querySelectorAll('.lang-btn').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
pickupInfoCheckbox.addEventListener('change', togglePickupInfoMode);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideMessage();
  togglePickupInfoMode();
  if (!acceptLegalCheckbox.checked) {
    showMessage(t('legalRequired'), 'error');
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = t('sending');
  try {
    const data = await api('/api/orders', { method: 'POST', body: JSON.stringify(formToObject(form)) });
    form.reset();
    togglePickupInfoMode();
    showSuccessCard(data.order.code);
    await loadAvailability();
  } catch (err) {
    showMessage(err.message, 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = t('submitOrder');
  }
});

applyLanguage(currentLang);
togglePickupInfoMode();
