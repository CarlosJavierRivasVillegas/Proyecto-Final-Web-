import { db } from '../lib/firebase';
import type { News } from '../types';

// Firestore helpers are imported dynamically to avoid pulling the whole SDK into the
// initial bundle. Each function imports only what it needs at call time.

export async function createNews(payload: Partial<News>) {
  const { collection, addDoc, getDoc } = await import('firebase/firestore');
  const newsCol = collection(db, 'news');
  const now = new Date();
  const ref = await addDoc(newsCol, {
    ...payload,
    createdAt: now,
    updatedAt: now,
    status: payload.status || 'editing',
  } as unknown as Record<string, unknown>);
  const snap = await getDoc(ref);
  const data = snap.data() as Record<string, unknown> | undefined;
  return { id: ref.id, ...(data || {}) } as unknown as News;
}

export async function updateNews(id: string, payload: Partial<News>) {
  const { doc, updateDoc } = await import('firebase/firestore');
  const ref = doc(db, 'news', id);
  await updateDoc(ref, { ...payload, updatedAt: new Date() } as unknown as Record<string, unknown>);
}

export async function deleteNews(id: string) {
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'news', id));
}

export async function getNewsById(id: string) {
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'news', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Record<string, unknown>) } as unknown as News;
}

export async function listPublishedNews() {
  const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
  const newsCol = collection(db, 'news');
  const q = query(newsCol, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as News));
}

export async function listPublishedNewsBySection(sectionName: string) {
  const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
  const newsCol = collection(db, 'news');
  const q = query(newsCol, where('status', '==', 'published'), where('category', '==', sectionName), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as News));
}

export async function listNewsByAuthor(authorId: string) {
  const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
  const newsCol = collection(db, 'news');
  const q = query(newsCol, where('authorId', '==', authorId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as News));
}

export async function listAllNews() {
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
  const newsCol = collection(db, 'news');
  const snaps = await getDocs(query(newsCol, orderBy('createdAt', 'desc')));
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as News));
}

export async function changeNewsStatus(id: string, status: 'editing' | 'finished' | 'published' | 'disabled') {
  const { doc, updateDoc } = await import('firebase/firestore');
  const ref = doc(db, 'news', id);
  await updateDoc(ref, { status, updatedAt: new Date() } as unknown as Record<string, unknown>);
}
