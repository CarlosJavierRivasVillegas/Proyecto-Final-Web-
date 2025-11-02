import { auth, db } from '../lib/firebase';
import type { UserRole } from '../types';

// Import auth/firestore helpers dynamically so they are only loaded when used.

export async function registerWithEmail(email: string, password: string, displayName: string, role: UserRole = 'reporter') {
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const { collection, doc, setDoc } = await import('firebase/firestore');
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;
  const usersRef = collection(db, 'users');
  await setDoc(doc(usersRef, uid), {
    uid,
    email,
    displayName,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return userCred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
}

export async function getUserRole(uid: string) {
  const { doc, getDoc } = await import('firebase/firestore');
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return data.role as UserRole | null;
}
