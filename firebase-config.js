// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxlG-MY9QI2kTImgA78EeGpS7JbkG7z94",
  authDomain: "gogreen-460d2.firebaseapp.com",
  projectId: "gogreen-460d2",
  storageBucket: "gogreen-460d2.appspot.com",
  messagingSenderId: "254402121491",
  appId: "1:254402121491:web:fce6c92a293c075b5914e6",
  measurementId: "G-YF7CHGZJ9T",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
