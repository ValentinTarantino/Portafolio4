import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzWPqdd0BbVN9wyfCF51ceG2TEUidPrEc",
  authDomain: "dinorecord-91bf0.firebaseapp.com",
  projectId: "dinorecord-91bf0",
  storageBucket: "dinorecord-91bf0.firebasestorage.app",
  messagingSenderId: "159129019943",
  appId: "1:159129019943:web:9465ccb7d4d620586ad002"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
