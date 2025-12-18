import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc,
  serverTimestamp
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

/* 🚫 Emoji Regex */
function hasEmoji(text) {
  return /[\u{1F300}-\u{1FAFF}]/u.test(text);
}

/* 📝 REGISTER */
window.register = async function () {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  let username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!username || !email || !password) {
    alert("Sila isi semua maklumat");
    return;
  }

  /* 🔍 Detect OWNER */
  let role = "user";
  let isOwner = false;

  if (username.toLowerCase().includes("dev")) {
    role = "owner";
    isOwner = true;
    username = username + " 🪬";
  }

  /* 🚫 Sekat emoji untuk user biasa */
  if (!isOwner && hasEmoji(username)) {
    alert("User biasa tidak dibenarkan guna emoji pada username");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    /* 📦 Simpan data user */
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      username: username,
      email: email,
      role: role,
      banned: false,

      profilePic: "",
      bio: "",

      live: {
        lastLive: 0,
        cooldown: 10 * 60 * 1000
      },

      createdAt: serverTimestamp()
    });

    alert("Pendaftaran berjaya!");
    window.location.href = "login.html";

  } catch (err) {
    alert("Gagal daftar: " + err.message);
  }
};
