import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import AppActiveGame from  "./AppActiveGame/AppActiveGame.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

var browserHistory = Router.browserHistory;

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" exact component={App} />
    <Route path="/AppActiveGame:activeGame" component={AppActiveGame} />
  </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
