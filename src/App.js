import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import TodoList from './Components/TodoList'

var firebaseui = require('firebaseui');

// Firestore setup
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

// Firebase UI Init
var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
ui.start('#firebaseui-auth-container', uiConfig);

// The actual app
function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  function handleSignOut() {
    firebase.auth().signOut();
    setIsSignedIn(false);
    window.location.reload(false);
  }

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, []);

  if (!isSignedIn) {
    return (
      <div className="page page--signed-out">
        <div className="layout-container">
          <h1>Your To-Do App</h1>
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    );
  }
  else if (isSignedIn) {
    return (
      <div className="page page--signed-in-success">
        <div className="layout-container">
          <TodoList/>
          <a className="btn btn--sign-out" onClick={handleSignOut}>Sign Out</a>
        </div>
      </div>
    );
  }
}

export default App;
