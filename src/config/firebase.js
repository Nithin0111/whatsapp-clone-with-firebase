import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBi_8uuWGO3rRuN-EJrb9lLeMkTJ0Wq1MM",
  authDomain: "whatsapp-clone-def73.firebaseapp.com",
  projectId: "whatsapp-clone-def73",
  storageBucket: "whatsapp-clone-def73.appspot.com",
  messagingSenderId: "818967688393",
  appId: "1:818967688393:web:2e1cc486078023b9d10918",
  measurementId: "G-3BM1EHCLDH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
