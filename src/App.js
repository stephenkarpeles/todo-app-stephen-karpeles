import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";
var firebaseui = require('firebaseui');

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

var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())

ui.start('#firebaseui-auth-container', uiConfig);

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
      <div>
        <div id="firebaseui-auth-container"></div>
      </div>
    );
  }
  else if (isSignedIn) {
    return (
      <div className="signed-in-success">
        <p>Welcome, you are now signed-in!</p>

        <a className="btn" onClick={handleSignOut}>Sign Out</a>
      </div>
    );
  }
}

export default App;
