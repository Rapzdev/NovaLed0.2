import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
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

let currentUserData = null;

/* 🔐 AUTH CHECK */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  currentUserData = snap.data();
});

/* 📤 UPLOAD POST */
window.uploadPost = async function () {
  const file = document.getElementById("fileInput").files[0];
  const caption = document.getElementById("caption").value;

  if (!file) {
    alert("Pilih gambar atau video");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    await addDoc(collection(db, "posts"), {
      uid: auth.currentUser.uid,
      username: currentUserData.username,
      role: currentUserData.role,
      caption: caption,
      file: reader.result, // BASE64
      type: file.type.startsWith("video") ? "video" : "image",
      createdAt: serverTimestamp()
    });

    document.getElementById("caption").value = "";
    document.getElementById("fileInput").value = "";
  };
  reader.readAsDataURL(file);
};

/* 📰 LOAD FEED REALTIME */
const feed = document.getElementById("feed");
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  feed.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div class="post-header">
        ${post.username} ${post.role === "owner" ? "🪬" : ""}
      </div>

      ${post.type === "video"
        ? `<video controls src="${post.file}"></video>`
        : `<img src="${post.file}">`
      }

      <div class="caption">${post.caption || ""}</div>
    `;

    feed.appendChild(div);
  });
});

/* 🔁 NAV */
window.goProfile = () => window.location.href = "profile.html";
window.logout = () => signOut(auth);
