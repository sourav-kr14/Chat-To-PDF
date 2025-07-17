// import { initializeApp } from "firebase/app";

import { getApp,getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBmCq6HjPV1mMiOkhd8Td1N7Hc_lF2bp5k",
  authDomain: "chat-to-pdf-e59cb.firebaseapp.com",
  projectId: "chat-to-pdf-e59cb",
  storageBucket: "chat-to-pdf-e59cb.firebasestorage.app",
  messagingSenderId: "418102189636",
  appId: "1:418102189636:web:0a2f065d58ebf2c1cbe611",
  measurementId: "G-3WDXSJ93RP"
};

const app = getApps().length === 0? initializeApp(firebaseConfig) :getApp();

const db=getFirestore(app);
const storage =getStorage(app);

export {db,storage}