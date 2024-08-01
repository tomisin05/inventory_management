// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw_d5BcCAs-UnCLNh4gNNu9n2LFjJTd3Y",
  authDomain: "inventory-management-fd444.firebaseapp.com",
  projectId: "inventory-management-fd444",
  storageBucket: "inventory-management-fd444.appspot.com",
  messagingSenderId: "656947399385",
  appId: "1:656947399385:web:a255401be9728e50174cc8",
  measurementId: "G-E262R3FHJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}