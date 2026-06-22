// Country list (Lob soporta envío global; estos son los principales destinos)
const COUNTRIES = [
    { code: 'CO', name: 'Colombia' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'CA', name: 'Canadá' },
    { code: 'MX', name: 'México' },
    { code: 'AR', name: 'Argentina' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BR', name: 'Brasil' },
    { code: 'CL', name: 'Chile' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CU', name: 'Cuba' },
    { code: 'DO', name: 'República Dominicana' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'HN', name: 'Honduras' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'PA', name: 'Panamá' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Perú' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'ES', name: 'España' },
    { code: 'DE', name: 'Alemania' },
    { code: 'FR', name: 'Francia' },
    { code: 'IT', name: 'Italia' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GB', name: 'Reino Unido' },
    { code: 'IE', name: 'Irlanda' },
    { code: 'NL', name: 'Países Bajos' },
    { code: 'BE', name: 'Bélgica' },
    { code: 'LU', name: 'Luxemburgo' },
    { code: 'CH', name: 'Suiza' },
    { code: 'AT', name: 'Austria' },
    { code: 'DK', name: 'Dinamarca' },
    { code: 'SE', name: 'Suecia' },
    { code: 'NO', name: 'Noruega' },
    { code: 'FI', name: 'Finlandia' },
    { code: 'IS', name: 'Islandia' },
    { code: 'PL', name: 'Polonia' },
    { code: 'CZ', name: 'República Checa' },
    { code: 'SK', name: 'Eslovaquia' },
    { code: 'HU', name: 'Hungría' },
    { code: 'RO', name: 'Rumania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'GR', name: 'Grecia' },
    { code: 'HR', name: 'Croacia' },
    { code: 'SI', name: 'Eslovenia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'LV', name: 'Letonia' },
    { code: 'LT', name: 'Lituania' },
    { code: 'MT', name: 'Malta' },
    { code: 'CY', name: 'Chipre' },
    { code: 'TR', name: 'Turquía' },
    { code: 'IL', name: 'Israel' },
    { code: 'AE', name: 'Emiratos Árabes Unidos' },
    { code: 'SA', name: 'Arabia Saudí' },
    { code: 'JP', name: 'Japón' },
    { code: 'KR', name: 'Corea del Sur' },
    { code: 'CN', name: 'China' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'TW', name: 'Taiwán' },
    { code: 'SG', name: 'Singapur' },
    { code: 'MY', name: 'Malasia' },
    { code: 'TH', name: 'Tailandia' },
    { code: 'PH', name: 'Filipinas' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'IN', name: 'India' },
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'Nueva Zelanda' },
    { code: 'ZA', name: 'Sudáfrica' },
    { code: 'EG', name: 'Egipto' },
    { code: 'MA', name: 'Marruecos' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenia' }
];

// Estados de EE.UU. (siglas + nombres) para validar el "state" cuando el pais es US.
const US_STATES = new Set(('AL,AK,AZ,AR,CA,CO,CT,DE,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,DC,ALABAMA,ALASKA,ARIZONA,ARKANSAS,CALIFORNIA,COLORADO,CONNECTICUT,DELAWARE,FLORIDA,GEORGIA,HAWAII,IDAHO,ILLINOIS,INDIANA,IOWA,KANSAS,KENTUCKY,LOUISIANA,MAINE,MARYLAND,MASSACHUSETTS,MICHIGAN,MINNESOTA,MISSISSIPPI,MISSOURI,MONTANA,NEBRASKA,NEVADA,NEW HAMPSHIRE,NEW JERSEY,NEW MEXICO,NEW YORK,NORTH CAROLINA,NORTH DAKOTA,OHIO,OKLAHOMA,OREGON,PENNSYLVANIA,RHODE ISLAND,SOUTH CAROLINA,SOUTH DAKOTA,TENNESSEE,TEXAS,UTAH,VERMONT,VIRGINIA,WASHINGTON,WEST VIRGINIA,WISCONSIN,WYOMING,DISTRICT OF COLUMBIA').split(','));

function isValidUSState(s) {
    return US_STATES.has(String(s || '').trim().toUpperCase());
}

function populateCountrySelects() {
    ['recipient-country', 'sender-country'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const defaultCode = 'CO'; // destinatario por defecto Colombia; el cliente lo cambia si envia al exterior
        sel.innerHTML = COUNTRIES.map(c =>
            `<option value="${c.code}"${c.code === defaultCode ? ' selected' : ''}>${c.name} (${c.code})</option>`
        ).join('');
    });
}

// Global Application State
const state = {
    lang: 'es',
    currentStep: 0, // 0 = landing, 1, 2, 3, 4 = wizard steps, 5 = success
    selectedPhotoSrc: null,
    rotation: 0,
    filters: {
        brightness: 100,
        contrast: 100,
        preset: 'normal' // normal, vintage, warm, bw
    },
    frontText: '¡Saludos desde Colombia!',
    message: '',
    sender: {
        name: '',
        address_line1: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'CO'
    },
    recipient: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'CO'
    },
    apiKey: 'test_pub_f29dcfc354131d3aac2c99f469d1c1a',
    isDevMode: false,
    cart: [],
    pricePerPostcardUSD: 4.50,
    pricePerPostcardCOP: 18000
};

// Bilingual dictionary
const i18n = {
    es: {
        dev_mode: "Modo Programador",
        step_1_label: "Foto",
        step_2_label: "Mensaje",
        step_3_label: "Revisar",
        step_4_label: "Pago",
        hero_title_1: "Envía Postales Reales",
        hero_title_2: "desde Colombia",
        hero_desc: "Toma una foto con tu celular, escribe un mensaje personalizado y nosotros imprimimos la postal física y la enviamos a cualquier lugar del mundo.",
        start_cta: "Crear mi Postal",
        gallery_title: "Galería de Muestra: Colombia Hermosa",
        gallery_cartagena_desc: "Calles coloniales y balcones coloridos.",
        gallery_cocora_desc: "Palmas de cera gigantes y paisajes andinos.",
        gallery_monserrate_desc: "Santuario blanco en la cima andina.",
        step1_title: "Selecciona y Edita tu Foto",
        upload_prompt_1: "Sube una foto de tu celular",
        upload_prompt_2: "O haz clic en una de la galería de abajo",
        btn_upload: "Subir foto",
        tourist_toggle: "Soy turista — usar dirección predeterminada de Postales Colombia",
        btn_rotate: "Rotar 90°",
        btn_retake: "Rehacer Foto",
        label_text_overlay: "Texto en el Frente",
        filter_brightness: "Brillo",
        filter_contrast: "Contraste",
        presets_title: "Filtros Rápidos",
        filter_normal: "Normal",
        filter_vintage: "Vintage",
        filter_warm: "Cálido",
        filter_bw: "B&N",
        alternative_gallery: "¿O prefieres usar una foto de muestra?",
        btn_back: "Atrás",
        btn_continue: "Continuar",
        step2_title: "Escribe el Mensaje y Dirección",
        section_message: "Mensaje de la Postal",
        label_message: "Mensaje para el destinatario",
        section_sender: "Remitente (Tú)",
        label_full_name: "Nombre Completo",
        section_recipient: "Destinatario (A quién va)",
        label_address1: "Dirección Línea 1",
        label_address2: "Dirección Línea 2 (Opcional)",
        label_city: "Ciudad",
        label_state: "Estado / Región",
        label_zip: "Código Postal",
        label_country: "País",
        live_preview_label: "Previsualización del Reverso (Haz clic para voltear)",
        hint_flip: "Haz clic sobre la postal para ver el otro lado",
        step3_title: "Confirma los Detalles de tu Postal",
        review_to: "Enviar a:",
        review_dest_country: "País Destino:",
        review_format: "Formato:",
        review_delivery: "Servicio Postal:",
        review_delivery_val: "USPS First-Class International (Envío global)",
        btn_proceed_checkout: "Proceder al Pago",
        step4_title: "Checkout y Envío",
        checkout_summary_print: "Impresión Postal Premium 4x6",
        checkout_summary_postage: "Estampilla y Envío Internacional",
        checkout_summary_total: "Total:",
        checkout_cardholder: "Nombre del Tarjetahabiente",
        checkout_cardnumber: "Número de Tarjeta",
        checkout_expiry: "Vencimiento",
        btn_pay: "Pagar con Mercado Pago",
        checkout_secure_text: "Pago seguro procesado por Mercado Pago. Impresión y envío por Lob.com",
        mp_pay_info: "Al continuar serás redirigido a Mercado Pago para completar el pago. Podrás pagar con tarjeta, PSE, Nequi, Daviplata o Efecty.",
        cart_title: "Tus postales",
        btn_add_another: "Agregar otra postal",
        checkout_summary_subtotal: "Postales",
        success_title: "¡Postal Enviada con Éxito!",
        success_desc: "Hemos procesado tu pago de $4.50 USD. La postal ha sido enviada al centro de impresión más cercano al destino y está en camino.",
        timeline_title: "Estado del Envío (Simulado)",
        timeline_step1_title: "Pago Confirmado & API de Impresión Contactada",
        timeline_step1_desc: "La postal se registró exitosamente en el sistema de Lob.",
        timeline_step2_title: "En Cola de Impresión",
        timeline_step2_desc: "Imprimiéndose en papel fotográfico satinado de 300g.",
        timeline_step3_title: "Entregado a USPS",
        timeline_step3_desc: "Estimado: En 24-48 horas.",
        timeline_step4_title: "Distribución y Entrega Física",
        timeline_step4_desc: "Estimado: Llegada en 7 a 10 días hábiles a la dirección.",
        success_details_id: "ID del Envío (Lob):",
        btn_send_another: "Enviar Otra Postal",
        dev_subtitle: "Esta consola muestra la carga útil (Payload) JSON exacta que generamos para enviar a la API de Lob.",
        dev_api_key_label: "Clave API de Lob (Opcional - Test/Live)",
        dev_btn_save: "Guardar",
        dev_api_key_hint: "Usa una clave de prueba de Lob.com para hacer peticiones API reales desde el navegador. Las credenciales se guardan localmente.",
        dev_json_payload: "Carga Útil JSON de Petición (POST /v1/postcards)",
        dev_api_response: "Respuesta de Lob API (Último Envío)",
        btn_paying: "Procesando pago..."
    },
    en: {
        dev_mode: "Developer Mode",
        step_1_label: "Photo",
        step_2_label: "Message",
        step_3_label: "Review",
        step_4_label: "Payment",
        hero_title_1: "Send Real Postcards",
        hero_title_2: "from Colombia",
        hero_desc: "Take a photo with your phone, write a personal message, and we print and mail the physical postcard anywhere in the world.",
        start_cta: "Create my Postcard",
        gallery_title: "Showcase Gallery: Beautiful Colombia",
        gallery_cartagena_desc: "Colonial streets and colorful balconies.",
        gallery_cocora_desc: "Giant wax palms and Andean landscapes.",
        gallery_monserrate_desc: "White sanctuary on the Andean peak.",
        step1_title: "Select & Edit Your Photo",
        upload_prompt_1: "Upload a photo from your phone",
        upload_prompt_2: "Or click on one from the gallery below",
        btn_upload: "Upload photo",
        tourist_toggle: "I'm a tourist — use Postales Colombia default address",
        btn_rotate: "Rotate 90°",
        btn_retake: "Retake Photo",
        label_text_overlay: "Front Text Overlay",
        filter_brightness: "Brightness",
        filter_contrast: "Contrast",
        presets_title: "Quick Filters",
        filter_normal: "Normal",
        filter_vintage: "Vintage",
        filter_warm: "Warm",
        filter_bw: "B&W",
        alternative_gallery: "Or would you prefer a sample photo?",
        btn_back: "Back",
        btn_continue: "Continue",
        step2_title: "Write Message & Address",
        section_message: "Postcard Message",
        label_message: "Message to recipient",
        section_sender: "Sender (You)",
        label_full_name: "Full Name",
        section_recipient: "Recipient (Who it goes to)",
        label_address1: "Address Line 1",
        label_address2: "Address Line 2 (Optional)",
        label_city: "City",
        label_state: "State / Region",
        label_zip: "ZIP / Postal Code",
        label_country: "Country",
        live_preview_label: "Backside Live Preview (Click to flip)",
        hint_flip: "Click on the postcard to flip and view the other side",
        step3_title: "Confirm Postcard Details",
        review_to: "Mail to:",
        review_dest_country: "Destination Country:",
        review_format: "Format:",
        review_delivery: "Postal Service:",
        review_delivery_val: "USPS First-Class International (Global delivery)",
        btn_proceed_checkout: "Proceed to Payment",
        step4_title: "Checkout & Send",
        checkout_summary_print: "Premium 4x6 Postcard Print",
        checkout_summary_postage: "Stamp & International Postage",
        checkout_summary_total: "Total:",
        checkout_cardholder: "Cardholder Name",
        checkout_cardnumber: "Card Number",
        checkout_expiry: "Expiration Date",
        btn_pay: "Pay with Mercado Pago",
        checkout_secure_text: "Secure payment by Mercado Pago. Printing and shipping by Lob.com",
        mp_pay_info: "You will be redirected to Mercado Pago to complete payment. You can pay with credit card, PSE, Nequi, Daviplata, or Efecty.",
        cart_title: "Your postcards",
        btn_add_another: "Add another postcard",
        checkout_summary_subtotal: "Postcards",
        success_title: "Postcard Sent Successfully!",
        success_desc: "We have processed your payment of $4.50 USD. The postcard has been sent to the printing center closest to its destination.",
        timeline_title: "Delivery Status (Simulated)",
        timeline_step1_title: "Payment Confirmed & Print API Contacted",
        timeline_step1_desc: "Postcard has been registered successfully in the Lob system.",
        timeline_step2_title: "In Printing Queue",
        timeline_step2_desc: "Printing on premium 300g glossy photo paper.",
        timeline_step3_title: "Handed over to USPS",
        timeline_step3_desc: "Estimated: Within 24-48 hours.",
        timeline_step4_title: "International Distribution & Delivery",
        timeline_step4_desc: "Estimated: Arrival in 7 to 10 business days to the address.",
        success_details_id: "Delivery ID (Lob):",
        btn_send_another: "Send Another Postcard",
        dev_subtitle: "This console displays the exact JSON request payload we generate to send to the Lob API.",
        dev_api_key_label: "Lob API Key (Optional - Test/Live)",
        dev_btn_save: "Save Key",
        dev_api_key_hint: "Add a Lob.com test API key to trigger actual live API requests from the browser. Keys are saved locally.",
        dev_json_payload: "JSON Request Payload (POST /v1/postcards)",
        dev_api_response: "Lob API Response (Last Request)",
        btn_paying: "Processing payment..."
    }
};

// Canvas & Image Contexts
let canvas, ctx;
let loadedImage = null;

// ===== Persistencia del progreso del cliente (anti-perdida por refresh / caida de internet) =====
const WIZARD_STATE_KEY = 'postales_wizard_state';
let _wizardSaveTimer = null;

function saveWizardState() {
    clearTimeout(_wizardSaveTimer);
    _wizardSaveTimer = setTimeout(() => {
        if (!state.currentStep || state.currentStep < 1) return; // solo guardar dentro del wizard
        const base = {
            v: 1,
            currentStep: state.currentStep,
            rotation: state.rotation,
            filters: state.filters,
            frontText: state.frontText,
            message: state.message,
            sender: state.sender,
            recipient: state.recipient,
            lang: state.lang
        };
        try {
            sessionStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(Object.assign({}, base, { selectedPhotoSrc: state.selectedPhotoSrc })));
        } catch (e) {
            // La foto puede ser muy grande para el almacenamiento: guardar al menos el progreso sin la foto
            try { sessionStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(base)); } catch (e2) {}
        }
    }, 400);
}

function clearWizardState() {
    try { sessionStorage.removeItem(WIZARD_STATE_KEY); } catch (e) {}
}

function restoreWizardState() {
    let data;
    try { data = JSON.parse(sessionStorage.getItem(WIZARD_STATE_KEY)); } catch (e) { return; }
    if (!data || !data.currentStep || data.currentStep < 1) return;

    // Idioma
    if (data.lang) updateLanguage(data.lang);

    // Filtros (deben quedar antes de dibujar la foto)
    if (data.filters) state.filters = Object.assign(state.filters, data.filters);
    const bSlider = document.getElementById('slider-brightness');
    const cSlider = document.getElementById('slider-contrast');
    if (bSlider) { bSlider.value = state.filters.brightness; document.getElementById('val-brightness').textContent = state.filters.brightness + '%'; }
    if (cSlider) { cSlider.value = state.filters.contrast; document.getElementById('val-contrast').textContent = state.filters.contrast + '%'; }
    document.querySelectorAll('.filter-preset-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === state.filters.preset);
    });

    // Texto del frente
    if (typeof data.frontText === 'string') {
        state.frontText = data.frontText;
        const ft = document.getElementById('front-text-input');
        if (ft) ft.value = data.frontText;
    }

    // Campos del formulario: setear valor y disparar 'input' para reusar la logica existente
    const restoreMap = [
        ['message-input', data.message || ''],
        ['sender-name', (data.sender || {}).name],
        ['sender-address1', (data.sender || {}).address_line1],
        ['sender-city', (data.sender || {}).address_city],
        ['sender-state', (data.sender || {}).address_state],
        ['sender-zip', (data.sender || {}).address_zip],
        ['sender-country', (data.sender || {}).address_country],
        ['recipient-name', (data.recipient || {}).name],
        ['recipient-address1', (data.recipient || {}).address_line1],
        ['recipient-address2', (data.recipient || {}).address_line2],
        ['recipient-city', (data.recipient || {}).address_city],
        ['recipient-state', (data.recipient || {}).address_state],
        ['recipient-zip', (data.recipient || {}).address_zip],
        ['recipient-country', (data.recipient || {}).address_country]
    ];
    restoreMap.forEach(pair => {
        const id = pair[0], val = pair[1];
        if (val === undefined || val === null) return;
        const el = document.getElementById(id);
        if (!el) return;
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Foto: al cargar restaura rotacion y redibuja con los filtros
    if (data.selectedPhotoSrc) {
        state.selectedPhotoSrc = data.selectedPhotoSrc;
        loadedImage = new Image();
        const ph = document.getElementById('upload-placeholder');
        if (ph) ph.style.display = 'none';
        loadedImage.onload = () => {
            state.rotation = data.rotation || 0;
            drawEditedImage();
            const nextBtn = document.getElementById('step1-next');
            if (nextBtn) nextBtn.removeAttribute('disabled');
            const miniFront = document.getElementById('card-front-mini');
            if (miniFront) { try { miniFront.src = canvas.toDataURL('image/jpeg', 0.85); } catch (e) {} }
            generateLobJSON();
        };
        loadedImage.src = data.selectedPhotoSrc;
    }

    // Volver al paso donde estaba el cliente
    showView('view-step-' + data.currentStep);
    generateLobJSON();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('editor-canvas');
    ctx = canvas.getContext('2d');
    
    // Set initial size of canvas (6:4 ratio)
    canvas.width = 600;
    canvas.height = 400;

    // Load saved API Key if any
    const savedKey = localStorage.getItem('lob_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
        state.apiKey = savedKey;
    }

    // Set initial event listeners
    initEventListeners();
    updateLanguage(state.lang);
    updateStepsBar();
    generateLobJSON();

    // Auto-guardar el progreso del cliente ante cualquier cambio (anti-perdida por refresh)
    document.addEventListener('input', saveWizardState);
    document.addEventListener('change', saveWizardState);

    // Restaurar progreso si el cliente refresco la pagina o se le cayo el internet
    restoreWizardState();
});

// Update DOM elements based on Selected Language
function updateLanguage(lang) {
    state.lang = lang;
    
    // Toggle active classes on language buttons
    document.querySelectorAll('#lang-toggle .lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    // Update Placeholders
    const inputs = {
        'front-text-input': '¡Saludos desde Colombia!',
        'message-input': 'Escribe aquí tus aventuras en Colombia...',
        'sender-name': 'John Doe',
        'recipient-name': 'Jane Smith',
        'recipient-address1': '123 Main Street, Apt 4B',
        'recipient-address2': 'Suite, floor, etc. (optional)',
        'recipient-city': 'New York',
        'recipient-state': 'NY',
        'recipient-zip': '10001'
    };

    if (lang === 'en') {
        inputs['front-text-input'] = 'Greetings from Colombia!';
        inputs['message-input'] = 'Write your adventures in Colombia here...';
        inputs['recipient-address2'] = 'Suite, floor, etc. (optional)';
    }

    for (const [id, value] of Object.entries(inputs)) {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('placeholder', value);
        }
    }
    
    // Re-draw canvas to update front text if translated
    if (loadedImage) {
        drawEditedImage();
    }
}

// Manage Wizard Navigation
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Hide/Show steps bar depending on view
    const stepsBar = document.getElementById('steps-bar');
    if (viewId === 'view-landing' || viewId === 'view-success' || viewId === 'view-track') {
        stepsBar.style.display = 'none';
    } else {
        stepsBar.style.display = 'flex';
    }
    
    // Update step numbers in state
    if (viewId === 'view-step-1') state.currentStep = 1;
    else if (viewId === 'view-step-2') state.currentStep = 2;
    else if (viewId === 'view-step-3') state.currentStep = 3;
    else if (viewId === 'view-step-4') state.currentStep = 4;
    else state.currentStep = 0;
    
    updateStepsBar();
    
    // Smooth scroll to top of panel
    document.getElementById('app-card-panel').scrollIntoView({ behavior: 'smooth' });

    saveWizardState();
}

// Update the top step indicator bar
function updateStepsBar() {
    if (state.currentStep === 0) return;
    
    document.querySelectorAll('.step-item').forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-step'));
        item.classList.remove('active', 'completed');
        
        if (stepNum === state.currentStep) {
            item.classList.add('active');
        } else if (stepNum < state.currentStep) {
            item.classList.add('completed');
        }
    });
    
    // Update connector line width
    const percentage = ((state.currentStep - 1) / 3) * 100;
    document.getElementById('steps-progress').style.width = `${percentage}%`;
}

// Setup Event Listeners
function initEventListeners() {
    // Logo Click triggers Landing
    document.getElementById('header-logo').addEventListener('click', () => {
        showView('view-landing');
    });

    // Language Toggle
    document.getElementById('lang-toggle').addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn')) {
            const selectedLang = e.target.getAttribute('data-lang');
            updateLanguage(selectedLang);
        }
    });

    // Dev console close button (panel hidden by default — modo programador toggle removed)
    const devConsoleCloseBtn = document.getElementById('dev-console-close');
    if (devConsoleCloseBtn) {
        devConsoleCloseBtn.addEventListener('click', () => {
            state.isDevMode = false;
            const dc = document.getElementById('dev-console');
            const ml = document.getElementById('main-layout');
            if (dc) dc.style.display = 'none';
            if (ml) ml.classList.remove('with-console');
        });
    }

    // Save API key (still works if user manually opens dev panel via console)
    const apiKeySaveBtn = document.getElementById('api-key-save-btn');
    if (apiKeySaveBtn) {
        apiKeySaveBtn.addEventListener('click', () => {
            const keyVal = document.getElementById('api-key-input').value.trim();
            state.apiKey = keyVal;
            localStorage.setItem('lob_api_key', keyVal);
            alert(state.lang === 'es' ? 'Clave de API guardada exitosamente.' : 'API Key saved successfully.');
            generateLobJSON();
        });
    }

    // Start Button
    document.getElementById('start-btn').addEventListener('click', () => {
        resetCameraUI();
        showView('view-step-1');
    });

    // Camera toggle button
    document.getElementById('btn-camera-toggle').addEventListener('click', () => {
        const toggleBtn = document.getElementById('btn-camera-toggle');
        if (toggleBtn.classList.contains('capturing')) {
            captureLivePhoto();
        } else {
            startLiveCamera();
        }
    });

    // Retake photo button
    document.getElementById('btn-retake').addEventListener('click', () => {
        startLiveCamera();
    });

    // Handle Predefined Gallery Click
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            const photoSrc = card.getAttribute('data-photo');
            loadPhoto(photoSrc);
            
            // If we are on landing, jump to step 1 editor automatically
            if (state.currentStep === 0) {
                showView('view-step-1');
            }
        });
    });

    // Photo Upload File input
    const photoInput = document.getElementById('photo-upload-input');
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                loadPhoto(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag & drop placeholder triggers file dialog
    document.getElementById('upload-placeholder').addEventListener('click', () => {
        photoInput.click();
    });

    // Editor Sliders
    const bSlider = document.getElementById('slider-brightness');
    bSlider.addEventListener('input', (e) => {
        state.filters.brightness = e.target.value;
        document.getElementById('val-brightness').textContent = `${e.target.value}%`;
        drawEditedImage();
    });

    const cSlider = document.getElementById('slider-contrast');
    cSlider.addEventListener('input', (e) => {
        state.filters.contrast = e.target.value;
        document.getElementById('val-contrast').textContent = `${e.target.value}%`;
        drawEditedImage();
    });

    // Preset Filters
    document.querySelectorAll('.filter-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.preset = btn.getAttribute('data-filter');
            drawEditedImage();
            saveWizardState();
        });
    });

    // Rotate 90° button
    document.getElementById('btn-rotate').addEventListener('click', () => {
        if (!loadedImage) return;
        state.rotation = (state.rotation + 90) % 360;
        drawEditedImage();
        saveWizardState();
    });

    // Front text overlay input
    const frontTextInput = document.getElementById('front-text-input');
    frontTextInput.addEventListener('input', (e) => {
        state.frontText = e.target.value;
        drawEditedImage();
    });

    // Step 1 buttons
    document.getElementById('step1-back').addEventListener('click', () => {
        resetCameraUI();
        showView('view-landing');
    });
    document.getElementById('step1-next').addEventListener('click', () => {
        if (loadedImage) {
            // Render mini card front preview for step 2
            const miniFront = document.getElementById('card-front-mini');
            try {
                miniFront.src = canvas.toDataURL('image/jpeg', 0.85);
            } catch (e) {
                console.warn("Canvas toDataURL failed. Falling back to original source.", e);
                miniFront.src = state.selectedPhotoSrc;
            }
            
            showView('view-step-2');
            generateLobJSON();
        }
    });

    // Step 2 Form Updates in real-time
    document.getElementById('message-input').addEventListener('input', (e) => {
        state.message = e.target.value;
        document.getElementById('message-char-count').textContent = e.target.value.length;
        
        // Update live preview message
        const msgPrev = document.getElementById('card-back-message-preview');
        msgPrev.innerHTML = e.target.value.replace(/\n/g, '<br>');
        generateLobJSON();
    });

    const formFields = [
        { inputId: 'sender-name', stateKey: 'name', parent: 'sender' },
        { inputId: 'recipient-name', stateKey: 'name', parent: 'recipient', prevId: 'card-back-name' },
        { inputId: 'recipient-address1', stateKey: 'address_line1', parent: 'recipient', prevId: 'card-back-addr1' },
        { inputId: 'recipient-address2', stateKey: 'address_line2', parent: 'recipient', prevId: 'card-back-addr2' },
        { inputId: 'recipient-city', stateKey: 'address_city', parent: 'recipient' },
        { inputId: 'recipient-state', stateKey: 'address_state', parent: 'recipient' },
        { inputId: 'recipient-zip', stateKey: 'address_zip', parent: 'recipient' },
        { inputId: 'recipient-country', stateKey: 'address_country', parent: 'recipient', prevId: 'card-back-country' }
    ];

    formFields.forEach(field => {
        const inputEl = document.getElementById(field.inputId);
        if (!inputEl) return;
        inputEl.addEventListener('input', () => {
            state[field.parent][field.stateKey] = inputEl.value;
            
            // Sync live preview fields
            if (field.prevId) {
                const prevEl = document.getElementById(field.prevId);
                if (field.inputId === 'recipient-country') {
                    prevEl.textContent = inputEl.options[inputEl.selectedIndex].text;
                } else {
                    prevEl.textContent = inputEl.value;
                }
            }
            
            // Handle City, State, ZIP combination line
            if (field.inputId === 'recipient-city' || field.inputId === 'recipient-state' || field.inputId === 'recipient-zip') {
                const city = state.recipient.address_city;
                const stateVal = state.recipient.address_state;
                const zip = state.recipient.address_zip;
                document.getElementById('card-back-city-state-zip').textContent = 
                    `${city}${city && stateVal ? ', ' : ''}${stateVal} ${zip}`.trim();
            }
            
            generateLobJSON();
        });
    });

    // Card Flipping logic (Step 2 and 3)
    document.getElementById('postcard-preview-inner-step2').addEventListener('click', (e) => {
        // Prevent flipping if they click on active inputs or links somehow
        document.getElementById('postcard-preview-inner-step2').classList.toggle('flipped');
    });

    document.getElementById('postcard-review-inner-step3').addEventListener('click', () => {
        document.getElementById('postcard-review-inner-step3').classList.toggle('flipped');
    });

    // Step 2 actions
    document.getElementById('step2-back').addEventListener('click', () => showView('view-step-1'));
    document.getElementById('step2-next').addEventListener('click', () => {
        // El remitente ya no se valida: es opcional (solo el nombre) y la direccion de retorno es fija US.
        // Validate recipient
        if (!state.recipient.name || !state.recipient.address_line1 || !state.recipient.address_city || !state.recipient.address_zip) {
            alert(state.lang === 'es' ? 'Por favor completa los campos de dirección del destinatario.' : 'Please complete the recipient address fields.');
            return;
        }
        // Si el destinatario es de EE.UU., el "Estado" debe ser válido (si no, Lob lo rechaza)
        if (state.recipient.address_country === 'US' && !isValidUSState(state.recipient.address_state)) {
            alert(state.lang === 'es'
                ? 'El "Estado / Región" no es válido para Estados Unidos.\n\n• Si tu destinatario NO es de EE.UU., cambia el campo "País".\n• Si SÍ es de EE.UU., usa la sigla (ej. FL, NY) o el nombre del estado.'
                : 'The "State" is not valid for the US.\n\n• If your recipient is NOT in the US, change the "Country" field.\n• If they are, use the abbreviation (e.g. FL) or the full state name.');
            return;
        }

        // Render step 3 Review items
        const cardFrontReview = document.getElementById('card-front-review');
        try {
            cardFrontReview.src = canvas.toDataURL('image/jpeg', 0.9);
        } catch (e) {
            console.warn("Canvas toDataURL failed. Falling back to original source.", e);
            cardFrontReview.src = state.selectedPhotoSrc;
        }
        
        // Sync message to review
        document.querySelector('#postcard-review-inner-step3 #card-back-message-review').innerHTML = state.message.replace(/\n/g, '<br>');
        
        // Sync address block to review
        document.getElementById('review-card-back-name').textContent = state.recipient.name;
        document.getElementById('review-card-back-addr1').textContent = state.recipient.address_line1;
        document.getElementById('review-card-back-addr2').textContent = state.recipient.address_line2;
        
        const city = state.recipient.address_city;
        const stateVal = state.recipient.address_state;
        const zip = state.recipient.address_zip;
        document.getElementById('review-card-back-city-state-zip').textContent = `${city}${city && stateVal ? ', ' : ''}${stateVal} ${zip}`.trim();
        
        const countryDropdown = document.getElementById('recipient-country');
        document.getElementById('review-card-back-country').textContent = countryDropdown.options[countryDropdown.selectedIndex].text;

        // Populate table recap
        document.getElementById('review-to-val').textContent = state.recipient.name;
        document.getElementById('review-country-val').textContent = countryDropdown.options[countryDropdown.selectedIndex].text;

        showView('view-step-3');
    });

    // Step 3 actions
    document.getElementById('step3-back').addEventListener('click', () => showView('view-step-2'));
    document.getElementById('step3-next').addEventListener('click', () => {
        renderCart();
        showView('view-step-4');
    });

    // Step 4 actions
    document.getElementById('step4-back').addEventListener('click', () => showView('view-step-3'));

    // Add another postcard to cart
    document.getElementById('btn-add-another-postcard').addEventListener('click', () => {
        addAnotherPostcardToCart();
    });

    // Payment Form Submit (MercadoPago redirect + Lob batch)
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitPostcardOrder();
    });

    // Populate country selects from COUNTRIES array
    populateCountrySelects();

    // Tourist mode toggle: pre-fill sender with default address (Postales Colombia)
    const touristToggle = document.getElementById('sender-tourist-toggle');
    if (touristToggle) {
        const TOURIST_DEFAULT = {
            'sender-name': 'Postales Colombia',
            'sender-address1': 'Calle 85 # 11-35',
            'sender-city': 'Bogota',
            'sender-state': 'Cundinamarca',
            'sender-zip': '110111',
            'sender-country': 'CO'
        };
        const KEY_MAP = {
            'sender-name': 'name',
            'sender-address1': 'address_line1',
            'sender-city': 'address_city',
            'sender-state': 'address_state',
            'sender-zip': 'address_zip',
            'sender-country': 'address_country'
        };
        touristToggle.addEventListener('change', () => {
            Object.keys(TOURIST_DEFAULT).forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                if (touristToggle.checked) {
                    el.value = TOURIST_DEFAULT[id];
                    el.disabled = true;
                    state.sender[KEY_MAP[id]] = TOURIST_DEFAULT[id];
                } else {
                    el.disabled = false;
                    el.value = id === 'sender-country' ? 'CO' : '';
                    state.sender[KEY_MAP[id]] = id === 'sender-country' ? 'CO' : '';
                }
            });
        });
    }

    // Handle return from MercadoPago
    handleMercadoPagoReturn();

    // ===== Rastreo: enganchar botones =====
    const navTrackBtn = document.getElementById('nav-track-btn');
    if (navTrackBtn) navTrackBtn.addEventListener('click', () => showView('view-track'));

    const trackBtn = document.getElementById('track-btn');
    if (trackBtn) trackBtn.addEventListener('click', trackPostcard);

    const trackInput = document.getElementById('track-id-input');
    if (trackInput) trackInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') trackPostcard(); });

    const trackBackBtn = document.getElementById('track-back-btn');
    if (trackBackBtn) trackBackBtn.addEventListener('click', () => showView('view-landing'));

    const successTrackBtn = document.getElementById('btn-success-track');
    if (successTrackBtn) successTrackBtn.addEventListener('click', () => {
        const idEl = document.getElementById('success-lob-id');
        const tInput = document.getElementById('track-id-input');
        if (idEl && tInput) tInput.value = (idEl.textContent || '').trim();
        showView('view-track');
        trackPostcard();
    });

    // Success Restart Button
    document.getElementById('btn-success-restart').addEventListener('click', () => {
        resetCameraUI();
        // Reset state (excluding API key)
        state.rotation = 0;
        state.filters.brightness = 100;
        state.filters.contrast = 100;
        state.filters.preset = 'normal';
        state.frontText = state.lang === 'es' ? '¡Saludos desde Colombia!' : 'Greetings from Colombia!';
        state.message = '';
        state.recipient = { name: '', address_line1: '', address_line2: '', address_city: '', address_state: '', address_zip: '', address_country: 'CO' };
        
        // Reset UI inputs
        document.getElementById('front-text-input').value = state.frontText;
        document.getElementById('message-input').value = '';
        document.getElementById('message-char-count').textContent = '0';
        document.getElementById('recipient-name').value = '';
        document.getElementById('recipient-address1').value = '';
        document.getElementById('recipient-address2').value = '';
        document.getElementById('recipient-city').value = '';
        document.getElementById('recipient-state').value = '';
        document.getElementById('recipient-zip').value = '';
        document.getElementById('recipient-country').value = 'CO';
        
        document.getElementById('slider-brightness').value = 100;
        document.getElementById('val-brightness').textContent = '100%';
        document.getElementById('slider-contrast').value = 100;
        document.getElementById('val-contrast').textContent = '100%';
        document.querySelectorAll('.filter-preset-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-filter') === 'normal');
        });

        // Clear previews
        document.getElementById('card-back-name').textContent = '';
        document.getElementById('card-back-addr1').textContent = '';
        document.getElementById('card-back-addr2').textContent = '';
        document.getElementById('card-back-city-state-zip').textContent = '';
        document.getElementById('card-back-message-preview').textContent = '';
        
        loadedImage = null;
        document.getElementById('upload-placeholder').style.display = 'flex';
        document.getElementById('step1-next').setAttribute('disabled', 'true');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        document.getElementById('api-response-panel').style.display = 'none';

        showView('view-landing');
    });
}

let mediaStream = null;

function resetCameraUI() {
    stopLiveCamera();
    const cameraToggleBtn = document.getElementById('btn-camera-toggle');
    const retakeBtn = document.getElementById('btn-retake');
    if (cameraToggleBtn) {
        cameraToggleBtn.innerHTML = `📷 <span>${state.lang === 'es' ? 'Usar Cámara' : 'Use Camera'}</span>`;
        cameraToggleBtn.classList.remove('capturing');
        cameraToggleBtn.style.background = 'var(--primary)';
        cameraToggleBtn.style.borderColor = 'var(--primary)';
        cameraToggleBtn.style.display = 'inline-flex';
    }
    if (retakeBtn) retakeBtn.style.display = 'none';
    const uploadBtnLabel = document.getElementById('upload-btn-label');
    if (uploadBtnLabel) uploadBtnLabel.style.display = 'inline-flex';
    const rotateBtn = document.getElementById('btn-rotate');
    if (rotateBtn) rotateBtn.style.display = 'inline-flex';
    const cameraStreamVideo = document.getElementById('camera-stream');
    if (cameraStreamVideo) cameraStreamVideo.style.display = 'none';
    const editorCanvas = document.getElementById('editor-canvas');
    if (editorCanvas) editorCanvas.style.display = 'block';
}

async function startLiveCamera() {
    const cameraToggleBtn = document.getElementById('btn-camera-toggle');
    const retakeBtn = document.getElementById('btn-retake');
    const cameraStreamVideo = document.getElementById('camera-stream');
    const uploadBtnLabel = document.getElementById('upload-btn-label');
    const rotateBtn = document.getElementById('btn-rotate');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const editorCanvas = document.getElementById('editor-canvas');

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } }, // rear camera ideal
            audio: false
        });

        uploadPlaceholder.style.display = 'none';
        editorCanvas.style.display = 'none';
        cameraStreamVideo.style.display = 'block';
        cameraStreamVideo.srcObject = mediaStream;

        // Change button to Tomar Foto
        cameraToggleBtn.innerHTML = `📸 <span>${state.lang === 'es' ? 'Tomar Foto' : 'Capture Photo'}</span>`;
        cameraToggleBtn.classList.add('capturing');
        cameraToggleBtn.style.background = '#ff453a';
        cameraToggleBtn.style.borderColor = '#ff453a';
        cameraToggleBtn.style.display = 'inline-flex';

        // Hide retake button and other buttons
        retakeBtn.style.display = 'none';
        uploadBtnLabel.style.display = 'none';
        rotateBtn.style.display = 'none';
        document.getElementById('step1-next').setAttribute('disabled', 'true');
    } catch (err) {
        console.error("Camera access error:", err);
        alert(state.lang === 'es' 
            ? "No se pudo acceder a la cámara. Por favor verifica tus permisos o sube un archivo."
            : "Unable to access camera. Please check your permissions or upload an image."
        );
    }
}

function captureLivePhoto() {
    const cameraToggleBtn = document.getElementById('btn-camera-toggle');
    const retakeBtn = document.getElementById('btn-retake');
    const cameraStreamVideo = document.getElementById('camera-stream');
    const uploadBtnLabel = document.getElementById('upload-btn-label');
    const rotateBtn = document.getElementById('btn-rotate');
    const editorCanvas = document.getElementById('editor-canvas');

    if (mediaStream && cameraStreamVideo.srcObject) {
        const context = canvas.getContext('2d');
        const videoW = cameraStreamVideo.videoWidth;
        const videoH = cameraStreamVideo.videoHeight;
        
        const videoRatio = videoW / videoH;
        const canvasRatio = canvas.width / canvas.height;

        let sx, sy, sWidth, sHeight;
        if (videoRatio > canvasRatio) {
            sHeight = videoH;
            sWidth = videoH * canvasRatio;
            sx = (videoW - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = videoW;
            sHeight = videoW / canvasRatio;
            sx = 0;
            sy = (videoH - sHeight) / 2;
        }

        context.drawImage(cameraStreamVideo, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        stopLiveCamera();

        const photoData = canvas.toDataURL('image/jpeg');
        loadedImage = new Image();
        loadedImage.onload = () => {
            state.rotation = 0;
            drawEditedImage();
            document.getElementById('step1-next').removeAttribute('disabled');
            generateLobJSON();
        };
        loadedImage.src = photoData;

        cameraStreamVideo.style.display = 'none';
        editorCanvas.style.display = 'block';

        // Hide camera toggle, show retake button
        cameraToggleBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-flex';

        uploadBtnLabel.style.display = 'inline-flex';
        rotateBtn.style.display = 'inline-flex';
    }
}

function stopLiveCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    const cameraStreamVideo = document.getElementById('camera-stream');
    if (cameraStreamVideo) cameraStreamVideo.srcObject = null;
}

// Load photo into canvas editor
function loadPhoto(src) {
    stopLiveCamera();
    state.selectedPhotoSrc = src;
    loadedImage = new Image();
    
    // Hide upload placeholder
    document.getElementById('upload-placeholder').style.display = 'none';
    
    // Reset camera UI buttons (show camera toggle, hide retake)
    const cameraToggleBtn = document.getElementById('btn-camera-toggle');
    const retakeBtn = document.getElementById('btn-retake');
    if (cameraToggleBtn) cameraToggleBtn.style.display = 'inline-flex';
    if (retakeBtn) retakeBtn.style.display = 'none';
    
    loadedImage.onload = () => {
        state.rotation = 0;
        drawEditedImage();
        document.getElementById('step1-next').removeAttribute('disabled');
        generateLobJSON();
        saveWizardState();
    };
    loadedImage.src = src;
}

// Draw image on Canvas applying rotations and filters.
// Acepta un canvas/contexto opcional para poder renderizar tambien en ALTA RESOLUCION
// (offscreen) sin cambiar el editor en pantalla.
function drawEditedImage(targetCanvas, targetCtx) {
    if (!loadedImage) return;
    const cnv = targetCanvas || canvas;
    const c = targetCtx || ctx;

    // Clear canvas
    c.clearRect(0, 0, cnv.width, cnv.height);
    c.save();

    // 1. Move to center to execute rotation
    c.translate(cnv.width / 2, cnv.height / 2);
    c.rotate((state.rotation * Math.PI) / 180);

    // Calculate dimensions to crop image (cover fit)
    let drawWidth, drawHeight;
    const isSideways = state.rotation === 90 || state.rotation === 270;

    // If rotated sideways, we map canvas height to width and vice versa
    const canvasW = isSideways ? cnv.height : cnv.width;
    const canvasH = isSideways ? cnv.width : cnv.height;

    const imageRatio = loadedImage.width / loadedImage.height;
    const canvasRatio = canvasW / canvasH;

    if (imageRatio > canvasRatio) {
        drawHeight = canvasH;
        drawWidth = canvasH * imageRatio;
    } else {
        drawWidth = canvasW;
        drawHeight = canvasW / imageRatio;
    }

    // Apply Filter presets in drawing context (CSS filter style)
    let filterString = `brightness(${state.filters.brightness}%) contrast(${state.filters.contrast}%)`;

    switch (state.filters.preset) {
        case 'vintage':
            filterString += ' sepia(60%) saturate(80%) hue-rotate(-10deg)';
            break;
        case 'warm':
            filterString += ' sepia(30%) saturate(110%)'; // simulated warmth
            break;
        case 'bw':
            filterString += ' grayscale(100%)';
            break;
        default:
            break;
    }

    c.filter = filterString;

    // Draw image centered in translation
    c.drawImage(loadedImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // Apply warm overlay manually if warm preset selected
    if (state.filters.preset === 'warm') {
        c.filter = 'none';
        c.fillStyle = 'rgba(255, 128, 0, 0.08)';
        c.fillRect(-drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    }

    c.restore(); // Restore context without rotation & filters

    // 2. Draw front text overlay if exists (always drawn straight)
    // Escalamos tipografia/offset segun el ancho del canvas (base de diseno = 600px)
    if (state.frontText) {
        const scale = cnv.width / 600;
        c.save();
        c.font = `bold ${Math.round(32 * scale)}px Outfit, sans-serif`;
        c.fillStyle = '#ffffff';
        c.textAlign = 'left';
        c.shadowColor = 'rgba(0, 0, 0, 0.8)';
        c.shadowBlur = 8 * scale;
        c.shadowOffsetX = 2 * scale;
        c.shadowOffsetY = 2 * scale;
        c.fillText(state.frontText, 25 * scale, cnv.height - 30 * scale);
        c.restore();
    }
}

// Genera la foto del FRENTE en ALTA RESOLUCION para Lob (300 DPI, 4x6 con sangrado).
// El editor en pantalla sigue a 600x400; esto solo se usa al armar el pedido.
function getHighResFrontDataURL() {
    if (!loadedImage) return getCurrentImageDataURL();
    try {
        const off = document.createElement('canvas');
        off.width = 1875;   // 6.25in x 300dpi
        off.height = 1275;  // 4.25in x 300dpi
        const offCtx = off.getContext('2d');
        drawEditedImage(off, offCtx);
        return off.toDataURL('image/jpeg', 0.92);
    } catch (e) {
        console.warn('No se pudo generar alta resolucion, uso la normal:', e);
        return getCurrentImageDataURL();
    }
}

// Generate the standard JSON Request Payload for Lob API
function generateLobJSON() {
    let frontImageBase64 = '';
    try {
        frontImageBase64 = loadedImage ? canvas.toDataURL('image/jpeg', 0.85) : '';
    } catch (e) {
        frontImageBase64 = '[base64_image_data_url_placeholder_due_to_local_file_restrictions]';
    }
    
    const payload = {
        description: `Postales Colombia - De ${state.sender.name || 'Viajero'} a ${state.recipient.name || 'Amigo'}`,
        to: {
            name: state.recipient.name || "Jane Smith",
            address_line1: state.recipient.address_line1 || "123 Main Street",
            address_line2: state.recipient.address_line2 || "",
            address_city: state.recipient.address_city || "New York",
            address_state: state.recipient.address_state || "NY",
            address_zip: state.recipient.address_zip || "10001",
            address_country: state.recipient.address_country || "US"
        },
        from: {
            name: state.sender.name || "John Doe",
            address_line1: state.sender.address_line1,
            address_city: state.sender.address_city,
            address_state: state.sender.address_state,
            address_zip: state.sender.address_zip,
            address_country: state.sender.address_country
        },
        front: frontImageBase64 ? "[base64_jpeg_image_data_url]" : "",
        message: state.message || "Escribe tu mensaje...",
        size: "4x6"
    };

    // Print JSON inside sandbox
    const codeBox = document.getElementById('json-payload-display');
    if (codeBox) {
        const jsonStr = JSON.stringify(payload, null, 2);
        codeBox.innerHTML = syntaxHighlightJSON(jsonStr);
    }
}

// Pretty formatting for JSON text in the panel
function syntaxHighlightJSON(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// ===== Cart helpers =====

function getCurrentImageDataURL() {
    try {
        if (typeof canvas !== 'undefined' && loadedImage) {
            return canvas.toDataURL('image/jpeg', 0.9);
        }
    } catch (e) { /* CORS or no canvas */ }
    if (state.selectedPhotoSrc && state.selectedPhotoSrc.startsWith('data:')) {
        return state.selectedPhotoSrc;
    }
    return '';
}

function snapshotCurrentPostcard() {
    // El pais que vale es el que el cliente VE seleccionado en el dropdown (blindaje contra desajustes por resets)
    const rcSel = document.getElementById('recipient-country');
    if (rcSel && rcSel.value) state.recipient.address_country = rcSel.value;
    return {
        sender: { ...state.sender },
        recipient: { ...state.recipient },
        message: state.message,
        frontText: state.frontText,
        selectedPhotoSrc: state.selectedPhotoSrc,
        filters: { ...state.filters },
        rotation: state.rotation,
        imageDataURL: getHighResFrontDataURL()
    };
}

function clearCurrentPostcard() {
    state.recipient = {
        name: '', address_line1: '', address_line2: '',
        address_city: '', address_state: '', address_zip: '',
        address_country: 'CO'
    };
    state.message = '';
    state.frontText = state.lang === 'es' ? '¡Saludos desde Colombia!' : 'Greetings from Colombia!';
    state.selectedPhotoSrc = null;
    state.filters = { brightness: 100, contrast: 100, preset: 'normal' };
    state.rotation = 0;
    if (typeof loadedImage !== 'undefined') loadedImage = null;
    ['recipient-name', 'recipient-address1', 'recipient-address2', 'recipient-city', 'recipient-state', 'recipient-zip', 'message-input', 'front-text-input']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const rcEl = document.getElementById('recipient-country');
    if (rcEl) rcEl.value = state.recipient.address_country; // sincronizar el selector de pais con el estado (evita el desajuste que vio Francisco)
    resetCameraUI();
}

function addAnotherPostcardToCart() {
    if (!state.recipient.name || !state.recipient.address_line1) {
        alert(state.lang === 'es'
            ? 'Completa al menos el destinatario de la postal actual antes de agregar otra.'
            : 'Complete at least the current postcard recipient before adding another.');
        return;
    }
    state.cart.push(snapshotCurrentPostcard());
    clearCurrentPostcard();
    showView('view-step-1');
}

function formatMoneyUSD(usd) {
    return `$${usd.toFixed(2)} USD`;
}

function formatMoneyCOP(cop) {
    return `$${cop.toLocaleString('es-CO')} COP`;
}

function renderCart() {
    const totalQty = state.cart.length + 1;
    const totalUSD = totalQty * state.pricePerPostcardUSD;
    const totalCOP = totalQty * state.pricePerPostcardCOP;

    const qtyEl = document.getElementById('cart-quantity-display');
    const subEl = document.getElementById('cart-subtotal');
    const totUSD = document.getElementById('cart-total-usd');
    const totCOP = document.getElementById('cart-total-cop');
    if (qtyEl) qtyEl.textContent = totalQty;
    if (subEl) subEl.textContent = `${formatMoneyUSD(state.pricePerPostcardUSD)} × ${totalQty}`;
    if (totUSD) totUSD.textContent = formatMoneyUSD(totalUSD);
    if (totCOP) totCOP.textContent = `~${formatMoneyCOP(totalCOP)}`;

    const list = document.getElementById('cart-items-list');
    if (!list) return;
    let html = '';
    state.cart.forEach((p, i) => {
        const thumb = p.imageDataURL
            ? `<img class="cart-item-thumb" src="${p.imageDataURL}" alt="">`
            : `<span class="cart-item-thumb-placeholder">📮</span>`;
        html += `<div class="cart-item">
            <span class="cart-item-num">${i + 1}</span>
            ${thumb}
            <div class="cart-item-info">
                <strong>${escapeHTML(p.recipient.name || '-')}</strong>
                <small>${escapeHTML(p.recipient.address_city || '-')}, ${escapeHTML(p.recipient.address_country || '-')}</small>
            </div>
        </div>`;
    });
    const currentImg = getCurrentImageDataURL();
    const currentThumb = currentImg
        ? `<img class="cart-item-thumb" src="${currentImg}" alt="">`
        : `<span class="cart-item-thumb-placeholder">📮</span>`;
    const currentTag = state.lang === 'es' ? '(actual)' : '(current)';
    html += `<div class="cart-item cart-item-current">
        <span class="cart-item-num">${state.cart.length + 1}</span>
        ${currentThumb}
        <div class="cart-item-info">
            <strong>${escapeHTML(state.recipient.name || '-')} <span class="cart-item-current-tag">${currentTag}</span></strong>
            <small>${escapeHTML(state.recipient.address_city || '-')}, ${escapeHTML(state.recipient.address_country || '-')}</small>
        </div>
    </div>`;
    list.innerHTML = html;
}

function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[s]));
}

// ===== MercadoPago =====

const MP_PENDING_KEY = 'postales_pending_cart';

// ===== Rastreo de postal (consulta el estado real a /api/track-postcard, que pregunta a Lob con la llave secreta) =====
async function trackPostcard() {
    const input = document.getElementById('track-id-input');
    const out = document.getElementById('track-result');
    if (!input || !out) return;
    const id = (input.value || '').trim();
    if (!/^psc_[a-zA-Z0-9]+$/.test(id)) {
        out.innerHTML = `<p style="color:#ff6b6b;">${state.lang === 'es' ? 'Número inválido. Debe empezar con "psc_".' : 'Invalid number. It must start with "psc_".'}</p>`;
        return;
    }
    out.innerHTML = `<p>${state.lang === 'es' ? 'Buscando...' : 'Searching...'}</p>`;
    try {
        const resp = await fetch('/api/track-postcard?id=' + encodeURIComponent(id));
        const data = await resp.json();
        if (!resp.ok) {
            out.innerHTML = `<p style="color:#ff6b6b;">${data.error || (state.lang === 'es' ? 'No encontramos esa postal.' : 'Postcard not found.')}</p>`;
            return;
        }
        out.innerHTML = renderTracking(data);
    } catch (e) {
        out.innerHTML = `<p style="color:#ff6b6b;">${state.lang === 'es' ? 'Error consultando el estado. Intenta de nuevo.' : 'Error checking status. Try again.'}</p>`;
    }
}

function renderTracking(data) {
    const es = state.lang === 'es';
    const labels = {
        'postcard.created': es ? 'Creada' : 'Created',
        'postcard.rendered_pdf': es ? 'Lista para imprimir' : 'Ready to print',
        'postcard.mailed': es ? 'Enviada al correo' : 'Mailed',
        'postcard.in_transit': es ? 'En tránsito' : 'In transit',
        'postcard.in_local_area': es ? 'Cerca del destino' : 'Near destination',
        'postcard.processed_for_delivery': es ? '¡Está por llegar!' : 'Out for delivery',
        'postcard.delivered': es ? '¡Entregada!' : 'Delivered',
        'postcard.re-routed': es ? 'Redirigida' : 'Re-routed',
        'postcard.returned_to_sender': es ? 'Devuelta al remitente' : 'Returned to sender'
    };
    let html = '';
    if (data.expectedDeliveryDate) {
        let d = data.expectedDeliveryDate;
        try { d = new Date(data.expectedDeliveryDate).toLocaleDateString(es ? 'es-CO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) {}
        html += `<p>${es ? 'Entrega estimada' : 'Estimated delivery'}: <strong>${d}</strong></p>`;
    }
    const events = (data.trackingEvents || []).slice().reverse();
    if (!events.length) {
        html += `<p>${es ? 'Aún no hay movimientos. Tu postal quedó registrada y pronto sale. Vuelve más tarde.' : 'No movements yet. Your postcard is registered and will ship soon. Check back later.'}</p>`;
    } else {
        html += '<ul style="list-style:none;padding:0;margin:12px 0;">';
        events.forEach((e) => {
            const label = labels[e.name] || e.name;
            let t = '';
            if (e.time) { try { t = new Date(e.time).toLocaleString(es ? 'es-CO' : 'en-US'); } catch (x) { t = e.time; } }
            html += `<li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);">✅ <strong>${label}</strong>${t ? ` <span style="color:#888;font-size:0.85rem;">— ${t}</span>` : ''}</li>`;
        });
        html += '</ul>';
    }
    if (data.url) {
        html += `<p style="margin-top:12px;"><a href="${data.url}" target="_blank" rel="noopener" onclick="return tryOpenPdf(event, this);">${es ? 'Ver cómo quedó tu postal (PDF)' : 'See your postcard (PDF)'}</a></p>`;
    }
    return html;
}

function buildLobBodiesFromPostcards(allPostcards) {
    return allPostcards.map(p => ({
        description: `Postales Colombia - De ${p.sender.name || 'Viajero'} a ${p.recipient.name || 'Amigo'}`,
        to: {
            name: p.recipient.name,
            address_line1: p.recipient.address_line1,
            address_line2: p.recipient.address_line2 || undefined,
            address_city: p.recipient.address_city,
            address_state: p.recipient.address_state,
            address_zip: p.recipient.address_zip,
            address_country: p.recipient.address_country
        },
        from: {
            name: p.sender.name || 'Postales Colombia Viajero',
            address_line1: p.sender.address_line1,
            address_city: p.sender.address_city,
            address_state: p.sender.address_state,
            address_zip: p.sender.address_zip,
            address_country: p.sender.address_country
        },
        front: p.imageDataURL,
        message: p.message || '',
        size: '4x6'
    }));
}

async function submitPostcardOrder() {
    const payBtn = document.getElementById('btn-pay-now');
    const errEl = document.getElementById('card-errors');
    const originalText = payBtn.innerHTML;

    if (errEl) errEl.textContent = '';

    if (!state.recipient.name || !state.recipient.address_line1 || !state.recipient.address_city || !state.recipient.address_zip) {
        if (errEl) errEl.textContent = state.lang === 'es'
            ? 'La postal actual no tiene destinatario completo.'
            : 'Current postcard recipient is incomplete.';
        return;
    }

    payBtn.setAttribute('disabled', 'true');
    payBtn.innerHTML = `<span class="spinner"></span> <span>${state.lang === 'es' ? 'Redirigiendo a Mercado Pago...' : 'Redirecting to Mercado Pago...'}</span>`;

    try {
        const allPostcards = [...state.cart, snapshotCurrentPostcard()];
        const quantity = allPostcards.length;
        const lobBodies = buildLobBodiesFromPostcards(allPostcards);

        // SEGURIDAD: nunca cobrar sin la foto. Si a alguna postal le falta el frente, abortar ANTES de pagar.
        const missingIdx = lobBodies.findIndex(b => !b.front || !String(b.front).startsWith('data:'));
        if (missingIdx !== -1) {
            if (errEl) errEl.textContent = state.lang === 'es'
                ? `Falta la foto de la postal ${missingIdx + 1}. Vuelve al Paso 1, selecciona la foto otra vez y reintenta (no se te cobró nada).`
                : `Postcard ${missingIdx + 1} is missing its photo. Go back to Step 1, select the photo again and retry (you were not charged).`;
            payBtn.removeAttribute('disabled');
            payBtn.innerHTML = originalText;
            return;
        }

        // SEGURIDAD: si algun destinatario es de EE.UU., el estado debe ser valido (Lob lo rechaza si no -> cobro sin entrega)
        const badUS = lobBodies.findIndex(b => b.to && b.to.address_country === 'US' && !isValidUSState(b.to.address_state));
        if (badUS !== -1) {
            if (errEl) errEl.textContent = state.lang === 'es'
                ? `Postal ${badUS + 1}: el "Estado" del destinatario no es válido para EE.UU. Si NO es de Estados Unidos, cambia el "País". (No se te cobró.)`
                : `Postcard ${badUS + 1}: recipient "State" is invalid for the US. If not in the US, change the "Country". (You were not charged.)`;
            payBtn.removeAttribute('disabled');
            payBtn.innerHTML = originalText;
            return;
        }

        const prefResp = await fetch('/api/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantity,
                siteOrigin: window.location.origin
            })
        });
        const prefData = await prefResp.json();
        if (!prefResp.ok) throw new Error(prefData.error || 'Error creando preferencia de pago');
        if (!prefData.initPoint) throw new Error('Mercado Pago no devolvió URL de pago');

        try {
            sessionStorage.setItem(MP_PENDING_KEY, JSON.stringify({
                postcards: lobBodies,
                externalReference: prefData.externalReference,
                quantity,
                createdAt: Date.now()
            }));
        } catch (storageErr) {
            // Si no podemos guardar el pedido, NO redirigir a pagar (evita cobrar sin poder imprimir)
            console.error('No se pudo guardar el carrito en sessionStorage:', storageErr);
            if (errEl) errEl.textContent = state.lang === 'es'
                ? 'No pudimos preparar tu pedido (la imagen pesa demasiado para el navegador). Usa una foto más liviana e inténtalo de nuevo.'
                : 'We could not prepare your order (image too large for the browser). Use a lighter photo and try again.';
            payBtn.removeAttribute('disabled');
            payBtn.innerHTML = originalText;
            return;
        }

        window.location.href = prefData.initPoint;
    } catch (err) {
        console.error('Submit error:', err);
        if (errEl) errEl.textContent = err.message;
        payBtn.removeAttribute('disabled');
        payBtn.innerHTML = originalText;
    }
}

async function handleMercadoPagoReturn() {
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('mp_status') || params.get('status');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if (!mpStatus && !paymentId) return;

    window.history.replaceState({}, document.title, window.location.pathname);

    const successDescEl = document.querySelector('#view-success .success-desc');
    const successIdEl = document.getElementById('success-lob-id');

    if (mpStatus === 'rejected' || mpStatus === 'failure') {
        alert(state.lang === 'es'
            ? 'El pago fue rechazado. Puedes intentar de nuevo.'
            : 'Payment was rejected. You can try again.');
        return;
    }
    if (mpStatus === 'pending') {
        alert(state.lang === 'es'
            ? 'El pago está pendiente de confirmación. Una vez aprobado, se imprimirán tus postales.'
            : 'Payment is pending confirmation. Postcards will be printed once approved.');
        return;
    }

    if (mpStatus !== 'approved' && mpStatus !== 'success') return;

    let pending;
    try {
        const raw = sessionStorage.getItem(MP_PENDING_KEY);
        if (raw) pending = JSON.parse(raw);
    } catch (e) { /* ignore */ }

    if (!pending || !pending.postcards) {
        alert(state.lang === 'es'
            ? 'Pago aprobado pero no encontramos los datos del carrito. Contacta soporte con tu ID de pago: ' + (paymentId || 'desconocido')
            : 'Payment approved but cart data was not found. Contact support with payment ID: ' + (paymentId || 'unknown'));
        return;
    }

    if (!paymentId) {
        alert(state.lang === 'es' ? 'No se recibió ID de pago de Mercado Pago.' : 'No payment ID received from Mercado Pago.');
        return;
    }

    showView('view-step-4');
    const payBtn = document.getElementById('btn-pay-now');
    if (payBtn) {
        payBtn.setAttribute('disabled', 'true');
        payBtn.innerHTML = `<span class="spinner"></span> <span>${state.lang === 'es' ? 'Pago aprobado, imprimiendo postales...' : 'Payment approved, printing postcards...'}</span>`;
    }

    try {
        const lobResp = await fetch('/api/create-postcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentId,
                postcards: pending.postcards
            })
        });
        const lobData = await lobResp.json();
        if (!lobResp.ok) {
            const detail = lobData.error
                || (lobData.errors && lobData.errors[0] && lobData.errors[0].error)
                || 'Error creando las postales';
            throw new Error(detail);
        }

        displayAPIResponse(lobData);
        const ids = lobData.ids || [];
        if (successIdEl) successIdEl.textContent = ids.join(', ') || '(sin IDs)';
        const totalUSD = formatMoneyUSD(pending.quantity * state.pricePerPostcardUSD);
        const firstOk = (lobData.results || []).find(r => r.ok) || {};
        let etaTxt = '';
        if (firstOk.expectedDeliveryDate) {
            try {
                etaTxt = new Date(firstOk.expectedDeliveryDate).toLocaleDateString(
                    state.lang === 'es' ? 'es-CO' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                );
            } catch (e) { etaTxt = firstOk.expectedDeliveryDate; }
        }
        // Mostrar el PDF de CADA postal (antes solo se mostraba la primera)
        const okResults = (lobData.results || []).filter(r => r.ok && r.url);
        let pdfLink = '';
        if (okResults.length === 1) {
            pdfLink = `<br><a href="${okResults[0].url}" target="_blank" rel="noopener" onclick="return tryOpenPdf(event, this);">${state.lang === 'es' ? 'Ver cómo quedó tu postal (PDF)' : 'See your postcard (PDF)'}</a>`;
        } else if (okResults.length > 1) {
            const lbl = state.lang === 'es' ? 'Postal' : 'Postcard';
            pdfLink = '<br>' + (state.lang === 'es' ? 'Ver tus postales: ' : 'See your postcards: ')
                + okResults.map((r, i) => `<a href="${r.url}" target="_blank" rel="noopener" onclick="return tryOpenPdf(event, this);">${lbl} ${i + 1} (PDF)</a>`).join(' · ');
        }
        // Si NO se crearon todas las que se pagaron, avisar claramente (nunca silencioso)
        const failedErrors = (lobData.errors || []);
        let warnHtml = '';
        if (ids.length < pending.quantity || failedErrors.length) {
            const errMsgs = failedErrors.map(e => e && e.error).filter(Boolean).join(' | ');
            warnHtml = state.lang === 'es'
                ? `<br><span style="color:#ffb020;">⚠️ Ojo: se crearon <strong>${ids.length} de ${pending.quantity}</strong> postales. ${failedErrors.length} fallaron${errMsgs ? ': ' + errMsgs : ''}. Guarda tu Payment ID y contáctanos para resolverlo.</span>`
                : `<br><span style="color:#ffb020;">⚠️ Note: <strong>${ids.length} of ${pending.quantity}</strong> postcards created. ${failedErrors.length} failed${errMsgs ? ': ' + errMsgs : ''}. Save your Payment ID and contact us.</span>`;
        }
        if (successDescEl) {
            if (state.lang === 'es') {
                successDescEl.innerHTML = `¡Pago de <strong>${totalUSD}</strong> verificado! <strong>${ids.length}</strong> postal(es) en camino.`
                    + (etaTxt ? ` Entrega estimada: <strong>${etaTxt}</strong>.` : '')
                    + ` ID(s): <strong>${ids.join(', ')}</strong>.` + pdfLink + warnHtml;
            } else {
                successDescEl.innerHTML = `Payment of <strong>${totalUSD}</strong> verified! <strong>${ids.length}</strong> postcard(s) on the way.`
                    + (etaTxt ? ` Estimated delivery: <strong>${etaTxt}</strong>.` : '')
                    + ` ID(s): <strong>${ids.join(', ')}</strong>.` + pdfLink + warnHtml;
            }
        }

        sessionStorage.removeItem(MP_PENDING_KEY);
        clearWizardState();
        state.cart = [];

        showView('view-success');
    } catch (err) {
        console.error('Post-payment error:', err);
        alert((state.lang === 'es' ? 'Pago aprobado pero falló la creación de postales: ' : 'Payment approved but postcard creation failed: ') + err.message + '\n\nPayment ID: ' + paymentId);
    } finally {
        if (payBtn) {
            payBtn.removeAttribute('disabled');
            payBtn.innerHTML = `<span data-i18n="btn_pay">${state.lang === 'es' ? 'Pagar con Mercado Pago' : 'Pay with Mercado Pago'}</span> 🚀`;
        }
    }
}

// Display Lob API Response in Sandbox Panel
function displayAPIResponse(data) {
    const responsePanel = document.getElementById('api-response-panel');
    const responseDisplay = document.getElementById('api-response-display');

    if (responsePanel && responseDisplay) {
        responsePanel.style.display = 'block';
        responseDisplay.innerHTML = syntaxHighlightJSON(JSON.stringify(data, null, 2));
    }
}

// Verifica con el backend que el PDF de Lob ya este disponible antes de abrirlo
// (Lob genera el PDF asincronicamente; los primeros segundos puede dar 404).
async function tryOpenPdf(event, anchor) {
    if (event && event.preventDefault) event.preventDefault();
    const url = anchor && anchor.href ? anchor.href : '';
    const lang = (typeof state !== 'undefined' && state.lang) || 'es';
    if (!url) return false;

    const originalText = anchor.textContent;
    const originalCursor = anchor.style.cursor;
    anchor.textContent = lang === 'es' ? 'Verificando...' : 'Checking...';
    anchor.style.pointerEvents = 'none';
    anchor.style.opacity = '0.6';

    let opened = false;
    try {
        const checkResp = await fetch('/api/check-pdf?url=' + encodeURIComponent(url));
        const data = await checkResp.json();
        if (data && data.ready) {
            window.open(url, '_blank', 'noopener');
            opened = true;
        } else {
            alert(lang === 'es'
                ? 'Tu postal aún se está procesando con la imprenta (suele tardar 30 a 60 segundos). Espera un momento y vuelve a hacer clic.'
                : 'Your postcard is still being processed by the printer (usually 30 to 60 seconds). Wait a moment and click again.');
        }
    } catch (err) {
        // Si la verificación falla, intentar abrir directo (mejor que bloquear al cliente)
        console.warn('check-pdf failed, opening direct:', err);
        window.open(url, '_blank', 'noopener');
        opened = true;
    } finally {
        anchor.textContent = originalText;
        anchor.style.pointerEvents = 'auto';
        anchor.style.opacity = '';
        anchor.style.cursor = originalCursor;
    }
    return false; // siempre prevenir la navegacion default; ya abrimos nosotros si tocaba
}
