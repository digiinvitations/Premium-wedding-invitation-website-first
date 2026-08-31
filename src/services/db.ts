import { doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { WeddingData } from "../types";
import { weddingData as defaultData } from "../data";

const DATA_DOC_ID = "main";

export async function getWeddingData(): Promise<WeddingData> {
  try {
    const docRef = doc(db, "weddingConfig", DATA_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as WeddingData;
    } else {
      // Initialize with default data if none exists
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    return defaultData; // Fallback
  }
}

export async function saveWeddingData(data: WeddingData): Promise<void> {
  const docRef = doc(db, "weddingConfig", DATA_DOC_ID);
  await setDoc(docRef, data);
}

export async function submitRSVP(rsvpData: any): Promise<void> {
  const rsvpCollection = collection(db, "rsvps");
  await addDoc(rsvpCollection, {
    ...rsvpData,
    submittedAt: new Date().toISOString()
  });
}

export async function getRSVPs(): Promise<any[]> {
  try {
    const rsvpCollection = collection(db, "rsvps");
    const snapshot = await getDocs(rsvpCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}
