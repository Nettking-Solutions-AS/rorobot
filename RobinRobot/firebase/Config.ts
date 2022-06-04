import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-WWPVniUxbwpy9DK9RYw17eZlqwjbWrw",
  authDomain: "rorobot-788d5.firebaseapp.com",
  projectId: "rorobot-788d5",
  storageBucket: "rorobot-788d5.appspot.com",
  messagingSenderId: "477535971406",
  appId: "1:477535971406:web:05b1bcfbbfa5939a3bfb1f",
  measurementId: "G-KDZCFTRE41",
};

let app: firebase.app.App;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

export const db = app.firestore();
export const auth = firebase.auth();

export default firebase;
