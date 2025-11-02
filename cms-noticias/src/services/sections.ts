import { db } from '../lib/firebase';
import type { Section } from '../types';

// Use dynamic imports for Firestore helpers to keep bundle lean.

export async function createSection(payload: Partial<Section>) {
  const { collection, addDoc, getDoc } = await import('firebase/firestore');
  const sectionsCol = collection(db, 'sections');
  const now = new Date();
  const ref = await addDoc(sectionsCol, { ...payload, createdAt: now, updatedAt: now } as unknown as Record<string, unknown>);
  const snap = await getDoc(ref);
  return { id: ref.id, ...(snap.data() as Record<string, unknown>) } as unknown as Section;
}

export async function updateSection(id: string, payload: Partial<Section>) {
  const { doc, updateDoc } = await import('firebase/firestore');
  const ref = doc(db, 'sections', id);
  await updateDoc(ref, { ...payload, updatedAt: new Date() } as unknown as Record<string, unknown>);
}

export async function deleteSection(id: string) {
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'sections', id));
}

export async function getSectionById(id: string) {
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'sections', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Record<string, unknown>) } as unknown as Section;
}

export async function listSections() {
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
  const sectionsCol = collection(db, 'sections');
  const q = query(sectionsCol, orderBy('name', 'asc'));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Section));
}
