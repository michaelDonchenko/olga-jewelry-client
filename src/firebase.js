import firebase from 'firebase'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
  appId: process.env.REACT_APP_APP_ID,
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

//export

export const auth = firebase.auth()

export const storage = firebase.storage()

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()