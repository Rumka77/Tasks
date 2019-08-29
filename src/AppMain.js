import React from "react";
import "./AppMain.css";
import GamesService  from "./GamesService.js";
import DataService   from "./DataService.js";
import GamesList     from  "./GamesList.js";
import AppActiveGame from  "./AppActiveGame/AppActiveGame.js";
import MarkImg       from './mark.jpg';
import { Redirect }  from "react-router-dom";

class AppMain extends React.Component{

  constructor(props) {
    super(props);
    this.state={
      games      : GamesService.getGames(),
      redirect   : false,
      activeGame : {},
    }
    if (!this.state.games) {
      this.state.games = [];
    }
  }

  addNewGame() {
    if (this.nameUser.value.split(" ").join("") > "") {
      this.name = this.nameUser.value;
      let newID = DataService.dateNowToStr();
      let newGame = {
        id          : newID,
        statusGame  : "AppMain-create-game",
        timer       : 0,
        nameUser1   : this.nameUser.value,
        statusUser1 : 0,
        nameUser2   : "",
        statusUser2 : 0,
        fieldsGame  : [[0,0,0], [0,0,0], [0,0,0]]
      };

      this.state.games.push(newGame);
      GamesService.saveGames(this.state.games);
      this.setState({games: GamesService.getGames()});
    }
    else {alert ("Неверное имя пользователя!")}
  }

  namePlayer(numUser, statusUser) {
    if ( ((numUser === 1)&&(statusUser === 2)) ||
         ((numUser === 2)&&(statusUser === 2)) ) {

      return "AppMain-container-winnerUser";
    }
  }

  drawMark(statusUser) {
    let res = "";
    if (statusUser === 2) {
      res = String.fromCharCode(10003);
    }
    return res;
  }

  setRedirect(game) {
    if ((game.statusGame==="AppMain-create-game") &&
        (this.nameUser.value!==game.nameUser1) &&
        (this.nameUser.value) &&
        (!game.nameUser2)) {

      game.statusGame  = "AppMain-start-game";
      game.statusUser1 = 1;
      game.nameUser2   = this.nameUser.value;

      GamesService.saveGames(this.state.games);
      this.setState({games: GamesService.getGames()});
    }

    this.setState({
      active   : game.id,
      redirect : true,
    });
  }

  //      let game = this.state.games;
  //      GamesService.deleteItems(this.game, 0, 1);
  //      GamesService.saveGames(this.state.games);
  //      this.setState({games: GamesService.getGames()});

  deleteOldGames(games) {
    let oldGames = games.filter(function(game) {
                                return (DataService.dateNowToStr() > DataService.idToDateStr(game.id)) ||
                                       (DataService.timeSec() - DataService.idToTimeSec(game.id) > 18000)
                                });
    if (oldGames.length > 0) {
      GamesService.deleteItems(oldGames, 0, oldGames.length - 1);
      GamesService.saveGames(this.state.games);
//    console.dir(oldGames);
    }
  };


  updateScreen() {
    this.deleteOldGames(this.state.games);
    this.setState({games: GamesService.getGames()});
  }

  componentDidMount() {
    this.screenId = setInterval( () => this.updateScreen(), 1000 );
  }

  componentWillUnmount() {
    clearInterval(this.screenId);
  }

  render() {
    //localStorage.setItem("games", JSON.stringify(GamesList));

    let games = this.state.games;
    if (!games) { games = []; }

    let activeGame = games.find(game => game.id === this.state.active);
    if (!activeGame) { activeGame = {}; }

    const {redirect} = this.state;
    if (redirect&&this.nameUser.value) {
      return <Redirect to={"/AppActiveGame/" + this.nameUser.value + "/" + activeGame.id} />;
    }

    return (
      <div className="AppMain">
        <div className="AppMain-header">
          Tic Tac Toe
        </div>

        <form id="AppMain-container">
          <label>
            <input type="text" className="AppMain-input_text" name="nameUser" ref={el=>this.nameUser=el} />
          </label>
          <div id="AppMain-games-container">
            {games.map(game => (
              <div key={(game.id)} className={(game.statusGame)} onClick={this.setRedirect.bind(this, game)}>
                <div id="AppMain-user1">
                  <div>
                    <p className={this.namePlayer(1, game.statusUser1)}> {game.nameUser1 } </p>
                  </div>
                  <div>
                    <p className="AppMain-container-winnerUser"> {this.drawMark(game.statusUser1)} </p>
                  </div>
                </div>

                <div id="AppMain-user2">
                  <div>
                    <p className={this.namePlayer(2, game.statusUser2)}> {game.nameUser2} </p>
                  </div>
                  <div>
                    <p className="AppMain-container-winnerUser"> {this.drawMark(game.statusUser2)} </p>
                  </div>
                </div>

                <div>
                </div>

              <div id="AppMain-timer-game">
                <span>{DataService.dateFormatted(Math.round(game.timer/60/60))} : </span>
                <span>{DataService.dateFormatted(Math.round(game.timer/60))} : </span>
                <span>{DataService.dateFormatted(game.timer%60)} </span>
              </div>
              </div>
            ))}
          </div>

        </form>

        <button className="AppMain-button" onClick={this.addNewGame.bind(this)}> + </button>
      </div>
    );
  }
}

export default AppMain;
