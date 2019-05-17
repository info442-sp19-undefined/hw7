import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import App from './App';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDx8jSTW3BxC-QMHbRSgyEcC59p0Br4yfE",
    authDomain: "ice-breakers-af61f.firebaseapp.com",
    databaseURL: "https://ice-breakers-af61f.firebaseio.com",
    projectId: "ice-breakers-af61f",
    storageBucket: "ice-breakers-af61f.appspot.com",
    messagingSenderId: "399650517987",
    appId: "1:399650517987:web:7fbade3616eabbe3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));