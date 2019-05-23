import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Your web app's Firebase configuration
const api_key = process.env.REACT_APP_FIREBASE_API_KEY;

let firebaseConfig = {
    apiKey: api_key,
    authDomain: "ice-breakers-af61f.firebaseapp.com",
    databaseURL: "https://ice-breakers-af61f.firebaseio.com",
    projectId: "ice-breakers-af61f",
    storageBucket: "ice-breakers-af61f.appspot.com",
    messagingSenderId: "399650517987",
    appId: "1:399650517987:web:2b16ba20914b7fbb"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));