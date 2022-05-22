import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD-WWPVniUxbwpy9DK9RYw17eZlqwjbWrw',
  authDomain: 'rorobot-788d5.firebaseapp.com',
  projectId: 'rorobot-788d5',
  storageBucket: 'rorobot-788d5.appspot.com',
  messagingSenderId: '477535971406',
  appId: '1:477535971406:web:05b1bcfbbfa5939a3bfb1f',
  measurementId: 'G-KDZCFTRE41'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
