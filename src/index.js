import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Modules/Main/js/Main.js';
import ActiveGame from  "./Modules/ActiveGame/js/ActiveGame.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as serviceWorker from './Modules/Main/js/serviceWorker';

var browserHistory = Router.browserHistory;

ReactDOM.render((
  <Router history={browserHistory}>
    <Route exact path="/" component={Main} />
    <Route path="/ActiveGame/js/:nameUser/:idGame" component={ActiveGame} />
  </Router>
), document.getElementById('root'));

serviceWorker.unregister();
