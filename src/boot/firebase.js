import Vue from 'vue'
import firebase from 'firebase'

// 'async' is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async (/* { app, router, Vue ... } */) => {
  const fb = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  })
  const db = fb.firestore()
  db.settings({ timestampsinsnapshots: true })
  // Gives access to Firestore and Firebase Auth to .vue components
  Vue.prototype.db = db
  Vue.prototype.auth = fb.auth()
}
