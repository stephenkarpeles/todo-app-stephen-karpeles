import React, { useEffect, useState } from 'react';
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

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document! Creating now.");

            db.collection("users").doc("uid").set({
              name: "userDoc"
            })
            console.log("Document written with ID: ", docRef.id);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  } else {
    // User is signed out
  }
});

const TodoList = () => {

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    db.collection('items').orderBy('datetime', 'desc').onSnapshot(snapshot => {
      setTodos(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          name: doc.data().todo,
          datatime: doc.data().datatime
        }
      }))
    })

  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    db.collection('items').add({
      todo: input,
      datetime: firebase.firestore.FieldValue.serverTimestamp()
    })
    setInput('');
  }

  return (
    <div>
      <h2>Your To-Do List</h2>
      
      <form className="add-todo-form" noValidate>

        <input
          required
          id="todo"
          label="Enter ToDo"
          name="todo"
          type="text"
          autoFocus
          value={input}
          onChange={event => setInput(event.target.value)}
        />

        <button
          type="submit"
          onClick={addTodo}
          disabled={!input}
        >
          Add Todo
      </button>

      </form>

       <ul className="todo-list">
        {
          todos.map(todo => (

            <li key={todo.id} >

              <div> 
                {todo.name}
                {todo.datetime}
              </div>

              <div>
                <div aria-label="Edit">
                  Edit
                </div>
              </div>

            </li>
          ))
        }
      </ul>

    </div>
  )
}

export default TodoList