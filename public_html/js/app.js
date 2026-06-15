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
        address_line1: 'Calle 85 # 11-35',
        address_city: 'Bogota',
        address_state: 'Cundinamarca',
        address_zip: '110111',
        address_country: 'CO'
    },
    recipient: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'US'
    },
    apiKey: 'test_pub_f29dcfc354131d3aac2c99f469d1c1a',
    isDevMode: false
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
        btn_upload: "Tomar o Subir Foto 📸",
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
        btn_pay: "Pagar y Enviar Postal",
        checkout_secure_text: "Encriptación SSL de 256 bits segura. Procesado mediante Lob.com",
        success_title: "¡Postal Enviada con Éxito!",
        success_desc: "Hemos procesado tu pago de $1.38 USD. La postal ha sido enviada al centro de impresión más cercano al destino y está en camino.",
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
        btn_upload: "Take or Upload Photo 📸",
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
        btn_pay: "Pay & Mail Postcard",
        checkout_secure_text: "Secured 256-bit SSL encryption. Processed via Lob.com",
        success_title: "Postcard Sent Successfully!",
        success_desc: "We have processed your payment of $1.38 USD. The postcard has been sent to the printing center closest to its destination.",
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
        'recipient-zip': '10001',
        'card-holder': 'John Doe',
        'card-number': '4111 2222 3333 4444'
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
    if (viewId === 'view-landing' || viewId === 'view-success') {
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

    // Developer Mode Toggle
    const devToggle = document.getElementById('dev-console-toggle');
    const devConsole = document.getElementById('dev-console');
    const mainLayout = document.getElementById('main-layout');

    devToggle.addEventListener('click', () => {
        state.isDevMode = !state.isDevMode;
        devToggle.classList.toggle('active', state.isDevMode);
        
        if (state.isDevMode) {
            devConsole.style.display = 'flex';
            mainLayout.classList.add('with-console');
        } else {
            devConsole.style.display = 'none';
            mainLayout.classList.remove('with-console');
        }
    });

    document.getElementById('dev-console-close').addEventListener('click', () => {
        state.isDevMode = false;
        devToggle.classList.remove('active');
        devConsole.style.display = 'none';
        mainLayout.classList.remove('with-console');
    });

    // Save API key
    document.getElementById('api-key-save-btn').addEventListener('click', () => {
        const keyVal = document.getElementById('api-key-input').value.trim();
        state.apiKey = keyVal;
        localStorage.setItem('lob_api_key', keyVal);
        alert(state.lang === 'es' ? 'Clave de API guardada exitosamente.' : 'API Key saved successfully.');
        generateLobJSON();
    });

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
        });
    });

    // Rotate 90° button
    document.getElementById('btn-rotate').addEventListener('click', () => {
        if (!loadedImage) return;
        state.rotation = (state.rotation + 90) % 360;
        drawEditedImage();
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
        // Validate inputs
        if (!state.recipient.name || !state.recipient.address_line1 || !state.recipient.address_city || !state.recipient.address_zip) {
            alert(state.lang === 'es' ? 'Por favor completa los campos de dirección requeridos.' : 'Please complete the required address fields.');
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
        // Fill checkout cardholder
        document.getElementById('card-holder').value = state.sender.name || '';
        showView('view-step-4');
    });

    // Step 4 actions
    document.getElementById('step4-back').addEventListener('click', () => showView('view-step-3'));
    
    // Credit Card formatting & validation detection
    const cardInput = document.getElementById('card-number');
    cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        // Group by 4 digits
        let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formatted;
        
        // Simple card type recognition
        const brandIcon = document.getElementById('card-brand-icon');
        if (val.startsWith('4')) {
            brandIcon.textContent = '💳 Visa';
        } else if (val.startsWith('5')) {
            brandIcon.textContent = '💳 Mastercard';
        } else if (val.startsWith('3')) {
            brandIcon.textContent = '💳 Amex';
        } else {
            brandIcon.textContent = '💳';
        }
    });

    // Card expiry formatting
    const expiryInput = document.getElementById('card-expiry');
    expiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            e.target.value = val.slice(0, 2) + '/' + val.slice(2, 4);
        } else {
            e.target.value = val;
        }
    });

    // Payment Form Submit
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitPostcardOrder();
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
        state.recipient = { name: '', address_line1: '', address_line2: '', address_city: '', address_state: '', address_zip: '', address_country: 'US' };
        
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
        document.getElementById('recipient-country').value = 'US';
        
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
    };
    loadedImage.src = src;
}

// Draw image on Canvas applying rotations and filters
function drawEditedImage() {
    if (!loadedImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // 1. Move to center to execute rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotation * Math.PI) / 180);

    // Calculate dimensions to crop image (cover fit)
    let drawWidth, drawHeight;
    const isSideways = state.rotation === 90 || state.rotation === 270;
    
    // If rotated sideways, we map canvas height to width and vice versa
    const canvasW = isSideways ? canvas.height : canvas.width;
    const canvasH = isSideways ? canvas.width : canvas.height;
    
    const imageRatio = loadedImage.width / loadedImage.height;
    const canvasRatio = canvasW / canvasH;

    if (imageRatio > canvasRatio) {
        // Image is wider than canvas ratio
        drawHeight = canvasH;
        drawWidth = canvasH * imageRatio;
    } else {
        // Image is taller than canvas ratio
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
    
    ctx.filter = filterString;

    // Draw image centered in translation
    ctx.drawImage(
        loadedImage, 
        -drawWidth / 2, 
        -drawHeight / 2, 
        drawWidth, 
        drawHeight
    );

    // Apply warm overlay manually if warm preset selected
    if (state.filters.preset === 'warm') {
        ctx.filter = 'none';
        ctx.fillStyle = 'rgba(255, 128, 0, 0.08)';
        ctx.fillRect(-drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    }

    ctx.restore(); // Restore context without rotation & filters

    // 2. Draw front text overlay if exists (always drawn straight)
    if (state.frontText) {
        ctx.save();
        ctx.font = 'bold 32px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        
        // Add drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw bottom-left of card
        ctx.fillText(state.frontText, 25, canvas.height - 30);
        ctx.restore();
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

// Submit Order Logic (Handles mock payment & actual API call to Lob if API key is input)
function submitPostcardOrder() {
    const payBtn = document.getElementById('btn-pay-now');
    const originalText = payBtn.innerHTML;
    
    // Disable inputs and show loading state
    payBtn.setAttribute('disabled', 'true');
    payBtn.innerHTML = `<span class="spinner"></span> <span>${state.lang === 'es' ? 'Procesando pago...' : 'Processing payment...'}</span>`;
    
    const simulationDelay = 2000; // 2 seconds

    setTimeout(async () => {
        // Check if there is a Lob API Key configured
        if (state.apiKey) {
            try {
                const response = await callRealLobAPI();
                displayAPIResponse(response);
                
                if (response.id) {
                    document.getElementById('success-lob-id').textContent = response.id;
                    if (state.lang === 'es') {
                        document.querySelector('#view-success .success-desc').innerHTML = `¡Pago verificado y postal creada exitosamente en tu cuenta de Lob! ID de Lob: <strong>${response.id}</strong>. Envío programado.`;
                    } else {
                        document.querySelector('#view-success .success-desc').innerHTML = `Payment verified and postcard created successfully in your Lob account! Lob ID: <strong>${response.id}</strong>. Mail scheduled.`;
                    }
                }
            } catch (err) {
                console.error("API Call error:", err);
                alert(state.lang === 'es' 
                    ? `Error al conectar con Lob API: ${err.message}. La transacción se simulará localmente.`
                    : `Error connecting to Lob API: ${err.message}. Transaction will fall back to local simulation.`
                );
                // Fallback to simulation
                document.getElementById('success-lob-id').textContent = `psc_simulated_${Math.random().toString(36).substr(2, 9)}`;
            }
        } else {
            // Local simulation ID
            document.getElementById('success-lob-id').textContent = `psc_simulated_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Restore button state
        payBtn.removeAttribute('disabled');
        payBtn.innerHTML = originalText;
        
        // Go to success view
        showView('view-success');
        
    }, simulationDelay);
}

// Execute the HTTP Request via Netlify Function (secure, hides Lob Secret Key)
async function callRealLobAPI() {
    let frontImageBase64 = '';
    try {
        frontImageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
        if (state.selectedPhotoSrc && state.selectedPhotoSrc.startsWith('data:')) {
            frontImageBase64 = state.selectedPhotoSrc;
        } else {
            throw new Error(state.lang === 'es' 
                ? "No se puede exportar la imagen debido a restricciones CORS. Sube una foto propia."
                : "Cannot export image due to CORS restrictions. Please upload your own photo."
            );
        }
    }
    
    const bodyData = {
        description: `Postales Colombia - De ${state.sender.name || 'Viajero'} a ${state.recipient.name || 'Amigo'}`,
        to: {
            name: state.recipient.name,
            address_line1: state.recipient.address_line1,
            address_line2: state.recipient.address_line2 || undefined,
            address_city: state.recipient.address_city,
            address_state: state.recipient.address_state,
            address_zip: state.recipient.address_zip,
            address_country: state.recipient.address_country
        },
        from: {
            name: state.sender.name || "Postales Colombia Viajero",
            address_line1: state.sender.address_line1,
            address_city: state.sender.address_city,
            address_state: state.sender.address_state,
            address_zip: state.sender.address_zip,
            address_country: state.sender.address_country
        },
        front: frontImageBase64,
        message: state.message,
        size: "4x6"
    };

    // Call Netlify Function (works on netlify.app and localhost with netlify dev)
    const functionUrl = '/.netlify/functions/create-postcard';
    
    const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
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
