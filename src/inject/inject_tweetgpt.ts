import { initializeApp } from "firebase/app";
import {
  getAuth,
  TwitterAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmsKz-Nfxxov1AR8qKUas6WLWhkLgAY8g",
  authDomain: "tweetgpt.firebaseapp.com",
  projectId: "tweetgpt",
  storageBucket: "tweetgpt.appspot.com",
  messagingSenderId: "140195492308",
  appId: "1:140195492308:web:ffdaa053c647927d3fa641",
};

window.addEventListener("load", () => {
  document.getElementById("no-extension")!.style.display = "none";
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  document.getElementById("preauth")!.style.display = "flex";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = (user as any).accessToken; // incorrect typings
      await chrome.runtime.sendMessage({type: "new_firebase_token", token});
      document.getElementById("preauth")!.style.display = "none";
      document.getElementById("afterauth")!.style.display = "flex";
    } else {
      await signInWithRedirect(getAuth(app), new TwitterAuthProvider());
    }
  });
});
