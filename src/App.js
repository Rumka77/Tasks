import React from "react";
import "./App.css";
import GamesService from "./gamesService.js";
import GamesList from  "./gamesList.js";
import AppActiveGame from  "./AppActiveGame/AppActiveGame.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state={
      games: GamesService.getGames()
    }
    if (!this.state.games) {
      this.state.games = [];
    }
  }

  addNewGame() {
    let newID = String((new Date()).getDate()) +
                String((new Date()).getMonth()+1) +
                String((new Date()).getFullYear()) +
                String((new Date()).getHours()) +
                String((new Date()).getMinutes()) +
                String((new Date()).getSeconds());
    let newGame = {
      id          : newID,
      statusGame  : "App-create-game",
      timer       : "00:00:00",
      nameUser1   : this.userName.value,
      statusUser1 : 0,
      nameUser2   : "",
      statusUser2 : 0,
      filedsGame  : [[0,0,0], [0,0,0], [0,0,0]]
    };

    this.state.games.push(newGame);
    GamesService.saveGames(this.state.games);
//    this.setState({games: GamesService.getGames});
  }

  showGame(id) {
    this.setState({
      active : id,
      form   : 1
    });
    //this.props.history.push("AppActiveGame");
    console.dir(id);
  }

  render() {
    localStorage.setItem("games", JSON.stringify(GamesList));

    let games = this.state.games;
    if (!games) {
      games = [];
    }
    //console.dir(games);

    let activeGame = games.find(game => game.id===this.state.active);
    if (!activeGame) {
      activeGame = {};
    }

    return (
      <div className="App">
        <div className="App-header">
          Tic Tac Toe
        </div>

        <form id="App-container">
          <label>
            <input type="text" className="App-input_text" name="userName" ref={el=>this.userName=el} /> <hr />
          </label>
          <div Link to="AppActiveGame" id="App-games-container">
            {games.map(game => (
              <div key={(game.id)} className={(game.statusGame)} onClick={this.showGame.bind(this, game.id)}>
                <p> {game.nameUser1} </p> <hr />
                <p> {game.nameUser2} </p>
                <p> {game.timer} </p>
              </div>
            ))}
          </div>

        </form>

        <button className="App-button" onClick={this.addNewGame.bind(this)}> + </button>
      </div>
    );
  }
}

export default App;
