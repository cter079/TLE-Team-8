import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { GeoFirestore } from 'geofirestore';


const firebaseConfig = {
    apiKey: "AIzaSyAKRcyEDjyTnFBtaHMRQdD2h7Wz-UKQXV8",
    authDomain: "sustainablehome-a536b.firebaseapp.com",
    projectId: "sustainablehome-a536b",
    storageBucket: "sustainablehome-a536b.appspot.com",
    messagingSenderId: "513685854383",
    appId: "1:513685854383:web:3468f586bd0ffeee541c5a",
    measurementId: "G-NV6BVGT4BH"
  };

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();

export default db;
export const geoFirestore = new GeoFirestore(db);
