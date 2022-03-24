import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBcRi1rQXRO2SVjB8zKdmO9t0GtS1Ap7Bg",
  authDomain: "todo-6810d.firebaseapp.com",
  projectId: "todo-6810d",
  storageBucket: "todo-6810d.appspot.com",
  messagingSenderId: "743246813998",
  appId: "1:743246813998:web:9ad8cfd2a2fd630c21f8bf"
};

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;