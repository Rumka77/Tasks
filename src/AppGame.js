import React from 'react';
import './AppGame.css';
import games from './games';
//import classNames from './classnames';

function App() {
  const choose_game = games.filter(function (game) {
  return game.id === "110072019211600Ivan"});
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
  //console.dir(choose_game);

  return (
    <div className="AppGame">
      <div className="AppGame-header">
        Tic Tac Toe
      </div>
      <form id="AppGame-container">
        {choose_game.map(game => (
          <div key={(game.id)}>
            <label>
              <p> {game.nameUser1} X    O {game.nameUser2} </p>
            </label>

            <div id="AppGame-fields-container">
              {game.filedsGame[0].map(field =>
                <div data-x="0" data-y={String(field)} className="AppGame-field">
                  {valueField(field)}
                </div>
              )}
            </div>
            <div id="AppGame-fields-container">
              {game.filedsGame[1].map(field =>
                <div data-x="1" data-y={String(field)} className="AppGame-field">
                  {valueField(field)}
                </div>
              )}
            </div>
            <div id="AppGame-fields-container">
              {game.filedsGame[2].map(field =>
                <div data-x="2" data-y={String(field)} className="AppGame-field">
                  {valueField(field)}
                </div>
              )}
            </div>

            <label>
              <p> {game.timer} </p>
            </label>
          </div>
        ))}

        <button> SURRENDER </button>
      </form>
    </div>
  );
}

export default App;
