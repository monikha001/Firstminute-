import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase.js";

const incidentsCollection = collection(db, "incidents");

export async function saveIncident(incident) {
  const docRef = await addDoc(incidentsCollection, {
    ...incident,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    ...incident,
    firestoreId: docRef.id,
  };
}

export async function getIncident(firestoreId) {
  const docRef = doc(db, "incidents", firestoreId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    firestoreId: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateIncident(firestoreId, updates) {
  const docRef = doc(db, "incidents", firestoreId);

  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}