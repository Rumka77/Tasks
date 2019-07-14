import React from 'react';
import './App.css';
import games from './games';
//import classNames from './classnames';

function App() {
  return (
    <div class="App">
      <div class="App-header">
        Tic Tac Toe
      </div>
      <form id="App-container">
        <label>
          <input type="text" class="App-input_text" name="userName" /> <hr />
        </label>
        <div id="App-games-container">
          {games.map(game => (
            <div key={(game.id)} class={(game.statusGame)}>
              <p> {game.nameUser1} </p> <hr />
              <p> {game.nameUser2} </p>
              <p> {game.timer} </p>
            </div>
          ))}
        </div>
      </form>
      <button class="App-button"> + </button>
    </div>
  );
}

export default App;
