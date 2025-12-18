import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyDbV5HqTM0NRBaUbV2sVC7rzk-Gxk9Ua8s",
  authDomain: "novaled-8a25b.firebaseapp.com",
  projectId: "novaled-8a25b",
  storageBucket: "novaled-8a25b.firebasestorage.app",
  messagingSenderId: "388507009182",
  appId: "1:388507009182:web:2ef38dbf0518260305fb8f",
  measurementId: "G-FTRZ7Q2SXM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 🔐 LOGIN */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Isi semua field");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      alert("Akaun tidak dijumpai");
      return;
    }

    const data = userDoc.data();

    if (data.banned === true) {
      alert("Akaun anda telah diban");
      return;
    }

    /* Owner / Admin */
    if (data.role === "owner") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }

  } catch (err) {
    alert("Login gagal: " + err.message);
  }
};
