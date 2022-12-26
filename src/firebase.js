import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// FIREBASE START

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyD2af0x8tm4S35GwyJ0-C2fZNzCyiPQYk0",
authDomain: "todoapp-750c4.firebaseapp.com",
projectId: "todoapp-750c4",
storageBucket: "todoapp-750c4.appspot.com",
messagingSenderId: "514461086654",
appId: "1:514461086654:web:8205b75fe108985ef8bfef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const db = getDatabase();

export default firebase;
// FIREBASE END