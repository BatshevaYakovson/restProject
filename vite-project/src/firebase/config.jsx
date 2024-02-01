import { initializeApp } from "firebase/app";
import {getStorage}from'firebase/storage';
import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA__EAFHVf2z6XPLvbOJBg9KqYZY6sGLxc",
  authDomain: "restpro-d83d0.firebaseapp.com",
  projectId: "restpro-d83d0",
  storageBucket: "restpro-d83d0.appspot.com",
  messagingSenderId: "844357406117",
  appId: "1:844357406117:web:b5abbdbf0e96e2cfa9ec4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


