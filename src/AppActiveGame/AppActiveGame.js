import React from 'react';
import './AppActiveGame.css';
import GamesList from  '../gamesList.js';
//import classNames from './classnames';

class AppActiveGame extends React.Component {

  render() {
      function valueField(val) {
      if (val===0) {
        return "";
      }
      else {
        if (val===1) {
          return "X";
        }
        else {
          return "O";
        }
      }
    };

    return (
      <div className="AppActiveGame">
        <div className="AppActiveGame-header">
          Tic Tac Toe
        </div>
        <form id="AppActiveGame-container">

          <div>
            111
          </div>

          <button> SURRENDER </button>

        </form>
      </div>
  );
}

}
export default AppActiveGame;
