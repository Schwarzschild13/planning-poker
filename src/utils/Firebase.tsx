import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyARiDyGCfPA-DMizol1PN-SCn4kXYN2hzo",
  databaseURL: "https://crud-bd650-default-rtdb.firebaseio.com",
  authDomain: "crud-bd650.firebaseapp.com",
  projectId: "crud-bd650",
  storageBucket: "crud-bd650.appspot.com",
  messagingSenderId: "888615011128",
  appId: "1:888615011128:web:7413bfea2600dca21437cd",
  measurementId: "G-R9PY6V0WKN",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
