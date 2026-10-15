# Mike Afro: tienda por WhatsApp con pagos

Investigación y plan técnico. Fecha: 2026-10-15.

## 1. Lo que hay que saber primero

- WhatsApp Pay (pago nativo dentro del chat) NO está activo para negocios en Colombia. Hoy solo opera en India (UPI) y Brasil (Pix). Colombia aparece como "en pruebas" en algunas fuentes, sin fecha.
- En Colombia, "pagar por WhatsApp" = el cliente arma el pedido en el chat, recibe un link de pago (Wompi / Bold / Mercado Pago) como botón dentro de la conversación, paga con Nequi, PSE, Bancolombia o tarjeta, y el sistema confirma automáticamente en el mismo chat.
- Para el cliente final la experiencia es casi nativa: nunca sale del flujo de WhatsApp salvo la pantalla de pago.

## 2. Tres niveles de montaje

### Nivel 1: Básico (WhatsApp Business App)
- App gratuita + catálogo (hasta 500 productos) + carrito nativo.
- Cliente envía carrito; Mike responde manualmente con un link de pago (Bold o Wompi desde el celular).
- Confirmación de pago manual.
- Costo fijo: 0. Solo comisión de pasarela.
- Límite: todo manual, no escala, no hay trazabilidad ni inventario.

### Nivel 2: Automatizado (recomendado)
- WhatsApp Cloud API (directo con Meta, sin BSP intermediario) + catálogo en Commerce Manager.
- Orquestación con n8n (self-hosted en Docker o VPS).
- Pasarela: Wompi (API de payment links + webhooks firmados).
- Base de datos: Supabase o Google Sheets para pedidos e inventario.
- Bot: menú, catálogo, carrito, link de pago, confirmación, guía de envío. Escalamiento a humano cuando el cliente lo pide.

### Nivel 3: E-commerce + WhatsApp
- Shopify o Tienda Nube + app de Wompi + integración WhatsApp.
- Sirve si Mike también quiere web, SEO y Meta Ads con catálogo dinámico.
- Mayor costo mensual (suscripción de plataforma en USD).

## 3. Arquitectura Nivel 2

```
Cliente WhatsApp
   │  (mensaje / carrito del catálogo)
   ▼
Meta Cloud API ──webhook──► n8n
                             │ 1. Parsear pedido (type=order, product_items)
                             │ 2. Validar stock + calcular total + envío
                             │ 3. Guardar pedido (estado PENDIENTE)
                             │ 4. POST Wompi /v1/payment_links (single_use)
                             │ 5. Enviar botón "Pagar" (interactive cta_url)
                             ▼
                          Wompi ──webhook transaction.updated──► n8n
                                                                 │ 6. Verificar firma (checksum SHA256)
                                                                 │ 7. APPROVED → pedido PAGADO, descontar stock
                                                                 │ 8. Mensaje confirmación al cliente
                                                                 │ 9. Notificar a Mike (WhatsApp / email)
                                                                 │ 10. DECLINED → reenviar link / opciones
```

### Detalles técnicos clave
- Pedido entrante: mensaje `type: "order"` con `catalog_id` y `product_items[]` (`product_retailer_id`, `quantity`, `item_price`, `currency`).
- Envío del link: mensaje interactivo `cta_url` (botón "Pagar ahora") dentro de la ventana de 24 h. Desde el 1-oct-2026 cuenta como mensaje de servicio cobrable (ver sección 5).
- Wompi payment link: `name`, `description`, `single_use: true`, `currency: COP`, `amount_in_cents`, `redirect_url`, `expires_at`. Guardar el `id` del link vinculado al pedido.
- Webhook Wompi: evento `transaction.updated`. Validar `signature.checksum` = SHA256(propiedades indicadas en `signature.properties` + `timestamp` + secreto de eventos). Sin firma válida no se marca nada como pagado.
- Idempotencia: un pago solo puede cerrar un pedido una vez (misma lógica que blindamos en postales-colombia: un pago no se reutiliza).
- Mensajes fuera de 24 h (recordatorio de carrito, aviso de despacho): plantillas aprobadas por Meta (utility / marketing).
- Diseño del bot para ahorrar mensajes: respuestas consolidadas (un mensaje con resumen + botón, no tres mensajes sueltos). Cada mensaje entregado cuenta.

## 4. Requisitos para arrancar (checklist para Mike)

- [ ] Meta Business Manager verificado (RUT o cámara de comercio, dominio o documento).
- [ ] Número telefónico dedicado. Si ya usa ese número en WhatsApp Business App, evaluar modo coexistencia (App + API en el mismo número) o migrar.
- [ ] Nombre visible del negocio aprobado por Meta.
- [ ] Método de pago cargado en Billing Hub de Meta (obligatorio desde 1-oct-2026: sin él no salen los mensajes de servicio).
- [ ] Cuenta Wompi comercio (persona natural o jurídica, RUT, cuenta bancaria). Llaves pública, privada, integridad y eventos.
- [ ] Catálogo: fotos, nombre, precio, SKU (`retailer_id`), descripción, stock inicial.
- [ ] Política de envíos, tiempos y cobertura (ciudades / transportadora).
- [ ] Términos, política de devoluciones y tratamiento de datos (Ley 1581).

## 5. Costos operativos estimados (actualizado con cambio Meta 1-oct-2026)

### Cambio de Meta vigente desde el 1 de octubre de 2026
- Se acabaron los mensajes de servicio gratis ilimitados en la API. Ahora se cobra por mensaje entregado, sea respuesta de humano o de bot/IA.
- Cada número de WhatsApp Business tiene 1.000 mensajes de servicio gratis por mes calendario. Desde el mensaje 1.001 se cobran (tarifa similar a utility). No se acumulan, se reinician cada mes.
- Las plantillas utility enviadas dentro de la ventana de 24 h también pasan a cobrarse.
- La ventana de 24 h sigue existiendo, pero ya no significa "gratis": define qué tipo de mensaje se puede enviar (libre vs. plantilla).
- Sigue gratis: los mensajes que el cliente envía, y las conversaciones que entran por anuncio Click-to-WhatsApp o botón CTA de página de Facebook (ventana de entrada gratuita de 72 h). Excepción: el agente de IA de Meta, que cobra por tokens.
- Es obligatorio tener método de pago en Billing Hub de Meta para que los mensajes de servicio sigan saliendo.
- La WhatsApp Business App (Nivel 1) NO se ve afectada.

### Tabla de costos (verificar en el rate card oficial de Meta)

| Concepto | Costo | Nota |
|---|---|---|
| Mensajes de servicio 1 a 1.000 / mes | Gratis | Por número telefónico |
| Mensajes de servicio desde el 1.001 | ~USD 0,0008 (~2,9 COP) / msg | Desde 1-oct-2026 |
| Plantilla utility (dentro o fuera de 24 h) | ~2,9 COP / msg | Descuento por volumen |
| Plantilla marketing | ~46 COP / msg (~USD 0,0125–0,0144) | Campañas, carrito abandonado |
| Entrada por anuncio Click-to-WhatsApp | Gratis 72 h | Todo tipo de mensaje |
| Wompi | ~2,65% + $700 + IVA por transacción | Tarifa plana reportada 2026, confirmar con Wompi |
| Bold (alternativa) | ~2,89% a 3,29% + $900 | Desembolso día siguiente |
| Mercado Pago (alternativa) | ~2,79% a 3,49% + cargos | Depende del plazo de desembolso |
| n8n self-hosted | VPS ~USD 5–12 / mes | O servidor propio |
| Supabase | Gratis (plan free) | Suficiente para el arranque |

Meta factura en COP en Colombia desde abril 2026. La tarifa la define el país del destinatario.

### Ejemplo: 300 ventas/mes de $80.000 = $24.000.000
- Wompi ≈ 2,65% + $700 + IVA ≈ $1.007.000.
- Meta: ~15 mensajes enviados por venta (dudas, resumen, link, confirmación, despacho) + ~600 conversaciones que no compran × 5 = ~7.500 mensajes. Menos 1.000 gratis = 6.500 × 2,9 ≈ $19.000 COP.
- Plantillas marketing (ej. 2.000 recordatorios/mes × 46) ≈ $92.000.
- Infraestructura < $50.000.
- Conclusión: el cambio de octubre no mueve el costo de forma relevante a este volumen; el costo fuerte sigue siendo la pasarela. Pero el bot debe diseñarse para ser conciso y conviene empujar tráfico vía anuncios Click-to-WhatsApp (72 h gratis).

## 6. Fases y tiempos

1. Semana 1: verificación Meta, cuenta Wompi, carga de catálogo.
2. Semana 2: flujos n8n (pedido → link → confirmación), base de datos, plantillas.
3. Semana 3: pruebas en sandbox Wompi, pruebas con clientes reales, ajustes.
4. Entrega: manual de operación + panel de pedidos.

Cuello de botella real: la verificación de Meta (de 2 días a 2 semanas).

## 7. Estructura sugerida para la propuesta comercial

- Setup único: configuración Meta + catálogo + flujos n8n + integración Wompi + pruebas.
- Mensualidad: hosting, mantenimiento, ajustes de catálogo, soporte.
- Opcional: campañas Meta Ads Click-to-WhatsApp con catálogo dinámico, plantillas de remarketing.
- Ajustar montos con base en la cotización ya enviada.

## 8. Pendientes por definir con Mike

- Qué vende exactamente y cuántos SKUs.
- Volumen esperado de pedidos / mes.
- Si ya tiene número WhatsApp Business activo y con historial.
- Si quiere web además del canal WhatsApp (Nivel 3).
- Ciudades de envío y transportadora.
- Si factura electrónicamente (DIAN) y con qué software.

## Fuentes

- SendPulse, cambio de precios de mensajes de servicio oct-2026: https://sendpulse.com/blog/whatsapp-service-message-pricing
- Techweez, cobro desde el mensaje 1.001: https://techweez.com/2026/09/28/whatsapp-business-pricing-october-2026/
- Zendesk, anuncio del cambio de precios: https://support.zendesk.com/hc/en-us/articles/11113277351322-Announcing-upcoming-changes-to-WhatsApp-Business-messaging-pricing
- YCloud, actualización 1-oct-2026: https://www.ycloud.com/blog/whatsapp-api-message-pricing-update-effective-october-1-2026
- ManyChat, guía de precios: https://help.manychat.com/hc/en-us/articles/14281380243740-WhatsApp-pricing-guide

- Meta, precios WhatsApp Business Platform: https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- Estado WhatsApp Pay por país 2026: https://aerochat.ai/blog/whatsapp-pay-for-ecommerce-country-by-country-status
- Catálogo WhatsApp, límites y MPM: https://chatarmin.com/en/blog/whatsapp-business-catalog
- Tarifas Meta por país (oct 2026): https://formbeep.com/whatsapp-api-pricing/
- Wompi, métodos de pago: https://docs.wompi.co/en/docs/colombia/metodos-de-pago/
- Comparativa pasarelas Colombia 2026: https://mentoracolombia.com/pasarelas-de-pago-colombia-2026-comisiones-wompi-bold-mercadopago/
- Comparativa Wompi / Bold / Mercado Pago: https://trujotechnologies.com/en/blog/comparativa-wompi-bold-mercado-pago-2026
- Pasarelas Colombia 2026: https://www.alejandroverjel.com/blog/ecommerce/pasarelas-de-pago-colombia-comparativa/
