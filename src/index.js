import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css'
import './roboto-font.css'
import * as firebase from "firebase";
import config from './firebase-config';

firebase.initializeApp(config);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
