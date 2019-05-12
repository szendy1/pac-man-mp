import * as firebase from 'firebase/app';
import 'firebase/firestore'
const config = {
  apiKey: "AIzaSyBB5VGzlVrbGg2VpG_bsikvf8kjeJ8NrDA",
  authDomain: "pac-man-mp.firebaseapp.com",
  databaseURL: "https://pac-man-mp.firebaseio.com",
  projectId: "pac-man-mp",
  storageBucket: "pac-man-mp.appspot.com",
  messagingSenderId: "491825287110",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const database = firebase.firestore()