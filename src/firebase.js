import firebase from 'firebase'
import config from './firebase.config.json'

firebase.initializeApp(config);
const db = firebase.firestore();
export { firebase, db };