// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsGuW-IKBby4u6P7I09JeIiB2ucaAp3v8",
  authDomain: "how-are-you-5e726.firebaseapp.com",
  projectId: "how-are-you-5e726",
  storageBucket: "how-are-you-5e726.appspot.com",
  messagingSenderId: "998409201010",
  appId: "1:998409201010:web:3bd10d45a4041c6f9469eb",
  measurementId: "G-39BHF66YLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

import Navbar from './components/navigation/navbar';

export default function Home() {
  return (
    <main>
      <h1>How Are You?</h1>
      <p>A mental health app for students, by students.</p>
    </main>
  );
}
