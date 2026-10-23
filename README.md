# Tarjeta de producto y compra simulada

Flujo mínimo de compra en React: el usuario ve los productos, elige una cantidad, ingresa los datos de su tarjeta y "paga". No hay backend, el pago se simula.

## Requisitos

- Node.js 22.12 o 24 en adelante (es lo que pide Vitest; Vite solo necesita 20.19)

## Cómo correrlo

```bash
npm install
npm run dev
```

La app queda en http://localhost:5173.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Corre todos los tests una vez |
| `npm run test:watch` | Tests en modo observador |
| `npm run lint` | ESLint |
| `npm run build` | Typecheck y build de producción |

## Cómo probar el pago

- Cualquier tarjeta válida según Luhn aprueba el pago, por ejemplo `4111 1111 1111 1111` (Visa), `5555 5555 5555 4444` (Mastercard) o `3782 8224 6310 005` (Amex).
- `4000 0000 0000 0002` siempre se rechaza.
- El vencimiento debe ser una fecha futura (por ejemplo `12/99`) y el CVV de 3 dígitos, o 4 para Amex.

## Stack

React 19, TypeScript, Vite, React-Bootstrap, React Icons, Vitest y Testing Library.

## Estructura

```
src/
  components/   ProductCard, CheckoutModal, PaymentForm, PaymentSuccess,
                FormField, AlertComponent
  helpers/      validators.ts, formatters.ts y types.ts (funciones puras, sin React)
  services/     paymentService.ts (pago simulado)
  App.tsx       estado de los productos (stock) y de la compra en curso
```

## Decisiones

**Validación separada de la UI.** Toda la validación y el formateo viven en `helpers/` como funciones puras. Cada `validate*` recibe un valor y devuelve el mensaje de error o `null`. Los componentes solo deciden cuándo mostrar ese error: después de salir del campo (blur) o al intentar enviar.

**Marca y CVV.** La marca se detecta mientras se escribe, con los rangos del enunciado (Visa, Mastercard 51-55 y 2221-2720, Amex 34 y 37). El largo del CVV depende de la marca.

**Pago simulado.** `processPayment` espera 1.5 segundos y aprueba o rechaza según el número de tarjeta, sin aleatoriedad, para que el comportamiento (y los tests) sean predecibles. Solo recibe el número de tarjeta: el CVV nunca sale del formulario. La respuesta solo trae el número de orden y los últimos 4 dígitos.

**Seguridad.**
- El número completo y el CVV viven en el estado del formulario únicamente mientras se escriben. Al aprobar el pago el formulario se desmonta y quedan solo los últimos 4 dígitos y el número de orden.
- Si el pago se rechaza se limpia el CVV y se conserva el resto para reintentar.
- No se usa `localStorage` ni `sessionStorage`, y no se escribe nada en consola.
- El CVV se oculta (`type="password"`) y los campos llevan `autocomplete` de pago (`cc-number`, `cc-exp`, `cc-csc`).

**Accesibilidad.** Cada input tiene su `label` asociado. Los errores se muestran junto al campo con `aria-invalid`, `aria-describedby` y `role="alert"` para que se anuncien. El modal tiene su título enlazado con `aria-labelledby`.

**Flujo del modal.** El modal solo se cierra con los botones Cancelar o Cerrar, no con Esc ni haciendo clic afuera. Mientras el pago se procesa se deshabilitan los campos y los botones, para que nadie lo cierre a mitad de la operación.

**Stock.** Vive en el estado de `App` y solo baja cuando el pago se aprueba. No se persiste: al recargar la página vuelve a los valores iniciales.

## Tests

- Unitarios de validadores, formateadores y del servicio de pago.
- `ProductCard`: cantidad, total, stock agotado y llamada a `onBuy`.
- Integración del flujo completo en `App.test.tsx`: abrir el formulario, errores por campo, formateo y marca, pago aprobado (orden, últimos 4 dígitos y stock), tarjeta rechazada con reintento, y cancelar.

Los tests de integración usan fake timers para no esperar los 1.5 segundos reales. Se configuran con `shouldAdvanceTime: true` y `userEvent.setup({ delay: null })`: sin eso, Testing Library se queda esperando un `setTimeout` que los timers falsos de Vitest nunca avanzan.

## Supuestos y límites

- Las tarjetas se formatean en grupos de 4 dígitos, incluida Amex (en la realidad es 4-6-5), como indica el enunciado.
- El número de tarjeta acepta de 13 a 19 dígitos para todas las marcas, como indica el enunciado, sin exigir un largo por marca.
- Un vencimiento `MM/AA` es válido hasta el final de ese mes, y `AA` se interpreta como `20AA`.
- Las imágenes de los productos vienen de picsum.photos, así que necesitan conexión a internet.
- La moneda (Q) está escrita directamente en los componentes.
