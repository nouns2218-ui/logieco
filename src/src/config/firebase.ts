import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REMPLACE_PAR_TA_CLE",
  authDomain: "logieco.firebaseapp.com",
  projectId: "logieco",
  storageBucket: "logieco.appspot.com",
  messagingSenderId: "REMPLACE",
  appId: "REMPLACE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
