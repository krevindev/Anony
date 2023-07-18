import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCAJwy6negkmK9WDRU-V0elzGWGbjL7B7o",
    authDomain: "anony-db.firebaseapp.com",
    projectId: "anony-db",
    storageBucket: "anony-db.appspot.com",
    messagingSenderId: "8983730221",
    appId: "1:8983730221:web:d6ec0710f134d90b9380a4"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };