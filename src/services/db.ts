import { doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { WeddingData } from "../types";
import { weddingData as defaultData } from "../data";

// Generate a unique ID based on the environment to prevent remixes from overwriting each other's data.
function getEnvironmentDocId() {
  if (typeof window === 'undefined') return "main";
  const hostname = window.location.hostname;
  // Match AI Studio preview URLs: ais-dev-HASH... or ais-pre-HASH...
  const match = hostname.match(/ais-(?:dev|pre)-([^.]+)/);
  if (match) {
    // Both official and remix get isolated IDs, so they never overlap.
    return `wedding_data_${match[1]}`;
  }
  // Deployed to Vercel/Custom Domain: use the official data
  return "main";
}

function getRsvpCollectionName() {
  if (typeof window === 'undefined') return "rsvps";
  const hostname = window.location.hostname;
  const match = hostname.match(/ais-(?:dev|pre)-([^.]+)/);
  if (match) {
    return `rsvps_${match[1]}`;
  }
  // Deployed to Vercel/Custom Domain
  return "rsvps";
}

const DATA_DOC_ID = getEnvironmentDocId();
const RSVP_COLLECTION = getRsvpCollectionName();

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
  const rsvpCollection = collection(db, RSVP_COLLECTION);
  await addDoc(rsvpCollection, {
    ...rsvpData,
    submittedAt: new Date().toISOString()
  });
}

export async function getRSVPs(): Promise<any[]> {
  try {
    const rsvpCollection = collection(db, RSVP_COLLECTION);
    const snapshot = await getDocs(rsvpCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}
