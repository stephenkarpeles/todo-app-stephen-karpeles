import React from 'react';
import TodoItem from './TodoItem'
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/compat/app';

const uiConfig = {
  apiKey: "AIzaSyBK7HENYQlL7VtmgelnD7irypxHSsR8Sw0",
  authDomain: "interview-code-challenge.firebaseapp.com",
  projectId: "interview-code-challenge",
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

if (!firebase.apps.length) {
  firebase.initializeApp(uiConfig);
} 

const db = firebase.firestore();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log(uid);

    var docRef = db.collection("users").doc(uid);
    var data = {};

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Creating now.");
            db.collection("users").doc(uid).set(data);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  } else {
    // User is signed out
  }
});

const TodoList = () => {
  return (
    <div>
      <h2>Your To-Do List</h2>
      <TodoItem/>
    </div>
  )
}

export default TodoList