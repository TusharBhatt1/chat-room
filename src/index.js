import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAldpyHLC5ZZzgXLVa7RuhjrbCmeaMTcSo",
  authDomain: "chat-room-dc6ea.firebaseapp.com",
  databaseURL: "https://chat-room-dc6ea-default-rtdb.firebaseio.com",
  projectId: "chat-room-dc6ea",
  storageBucket: "chat-room-dc6ea.appspot.com",
  messagingSenderId: "69358454462",
  appId: "1:69358454462:web:3b031babae6c5d2da400ef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
