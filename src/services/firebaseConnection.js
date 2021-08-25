import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZRuPI3tQlteLWlBoBbs6s08mOqJNZ61g",
  authDomain: "techsupv2.firebaseapp.com",
  projectId: "techsupv2",
  storageBucket: "techsupv2.appspot.com",
  messagingSenderId: "151122226647",
  appId: "1:151122226647:web:35deeff61797cd15256f92"
};
  // Verificação para ver se tem conexão aberta
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

export default firebase;