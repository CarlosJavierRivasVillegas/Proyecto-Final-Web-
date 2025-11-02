Guía rápida para configurar Firebase (Firestore + Auth + Storage)

1) Reemplaza `src/lib/firebase.ts` con tu `firebaseConfig` que obtendrás al registrar la app web en Firebase Console.

2) Reglas de Firestore sugeridas:
   - El archivo `firestore.rules` en la raíz del proyecto contiene un set de reglas sugeridas. Pégalas en la pestaña "Rules" de Firestore y ajústalas si lo deseas.

3) Storage:
   - Si quieres habilitar almacenamiento de imágenes, debes actualizar el plan a Blaze (requiere método de pago). Después crea el bucket de Storage desde Firebase Console.
   - El helper `src/services/storage.ts` ya está preparado para subir archivos y devolver la URL pública. Simplemente llama a `uploadFile(file)` desde el formulario de noticias (ya integrado en el código).

4) Variables de entorno y despliegue:
   - Nunca publiques las claves privadas en el repositorio. `firebaseConfig` contiene keys públicas (apiKey) que normalmente se pueden usar en el frontend, pero si quieres ocultarlas, usa variables de entorno en Vercel (VITE_ prefijo).

5) Recomendación de seguridad:
   - Revisa las reglas y pruébalas con el emulator de Firebase si es posible.
