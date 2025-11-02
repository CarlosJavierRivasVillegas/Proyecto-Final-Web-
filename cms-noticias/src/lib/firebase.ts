import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener servicios (storage se carga dinámicamente para reducir bundle)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Devuelve la instancia de Storage sólo cuando se necesite (import dinámico)
export async function getStorageInstance() {
  const mod = await import('firebase/storage');
  return mod.getStorage(app);
}

export default app;