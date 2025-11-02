import { getStorageInstance } from '../lib/firebase';

// Carga dinámica del SDK de Storage para evitar añadirlo al bundle inicial.
export async function uploadFile(file: File, pathPrefix = 'images', onProgress?: (percent: number) => void): Promise<string> {
  // Intentamos obtener la instancia de Storage (puede fallar si no está habilitado)
  const storage = await getStorageInstance();
  const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
  const storageRef = ref(storage, `${pathPrefix}/${Date.now()}_${file.name}`);
  const task = uploadBytesResumable(storageRef, file);
  return new Promise<string>((resolve, reject) => {
    task.on('state_changed',
      (snapshot) => {
        if (onProgress) {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(percent);
        }
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
