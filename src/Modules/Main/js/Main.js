import React from 'react';
import '../css/Main.css';
import GamesService  from '../../../System/Service/js/GamesService.js';
import DataService   from '../../../System/Service/js/DataService.js';
import GamesList     from  '../../../System/Service/js/GamesList.js';
import ActiveGame    from  '../../ActiveGame/js/ActiveGame.js';
import MarkImg       from '../pict/mark.jpg';
import Header        from '../../../System/Themes/js/Header.js';
import { Redirect }  from 'react-router-dom';

const STATUS_USER_DEFAULT = 0;
const STATUS_USER_WAITING = 1;
const STATUS_USER_WINNER  = 2;

const STATUS_GAME_CREATE  = "Create-game";
const STATUS_GAME_START   = "Start-game";

class Main extends React.Component{

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
      let newID = DataService.dateNowToStr() +
                  DataService.timeNowToStr() +
                  this.nameUser.value;
      let newGame = {
        id          : newID,
        statusGame  : STATUS_GAME_CREATE,
        timer       : 0,
        nameUser1   : this.nameUser.value,
        statusUser1 : STATUS_USER_DEFAULT,
        nameUser2   : "",
        statusUser2 : STATUS_USER_DEFAULT,
        fieldsGame  : [[0,0,0], [0,0,0], [0,0,0]]
      };

      this.state.games.push(newGame);
      GamesService.saveGames(this.state.games);
      this.setState({games: GamesService.getGames()});
    }
    else {
      alert ("Неверное имя пользователя!")
    }
  }

  namePlayer(numUser, statusUser) {
    if ( ((numUser === 1)&&(statusUser === STATUS_USER_WINNER)) ||
         ((numUser === 2)&&(statusUser === STATUS_USER_WINNER)) ) {

      return "Main-container-winnerUser";
    }
  }

  drawMark(statusUser) {
    let res = "";
    if (statusUser === STATUS_USER_WINNER) {
      res = String.fromCharCode(10003);
    }
    return res;
  }

  setRedirect(game) {
    if ((game.statusGame === STATUS_GAME_CREATE) &&
        (this.nameUser.value!==game.nameUser1) &&
        (this.nameUser.value) &&
        (!game.nameUser2)) {

      game.statusGame  = STATUS_GAME_START;
      game.statusUser1 = STATUS_USER_WAITING;
      game.nameUser2   = this.nameUser.value;

      GamesService.saveGames(this.state.games);
      this.setState({games: GamesService.getGames()});
    }

    this.setState({
      active   : game.id,
      redirect : true,
    });
  }

  deleteOldGames(games) {
    let oldGames = games.filter(function(game) {
                                  return (DataService.dateNowToStr() !== DataService.idToDateStr(game.id)) ||
                                         (DataService.timeNowSec() - DataService.idToTimeSec(game.id) > 18000)
                                });
//    if (oldGames.length > 0) {
//      GamesService.deleteItems(oldGames, 0, oldGames.length - 1);
//      GamesService.saveGames(this.state.games);
//    console.dir(oldGames);
//    }
  };


  updateScreen() {
    //this.deleteOldGames(this.state.games);
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
      return <Redirect to={"/ActiveGame/js/" + this.nameUser.value + "/" + activeGame.id} />;
    }

    return (
      <div className="Main">
        <Header />

        <form id="Main-container">
          <label>
            <input type="text" className="Main-input_text" name="nameUser" ref={el=>this.nameUser=el} />
          </label>
          <div id="Main-games-container">
            {games.map(game => (
              <div key={(game.id)} className={(game.statusGame)} onClick={this.setRedirect.bind(this, game)}>
                <div id="Main-user1">
                  <div>
                    <p className={this.namePlayer(1, game.statusUser1)}> {game.nameUser1 } </p>
                  </div>
                  <div>
                    <p className="Main-container-winnerUser"> {this.drawMark(game.statusUser1)} </p>
                  </div>
                </div>

                <div id="Main-user2">
                  <div>
                    <p className={this.namePlayer(2, game.statusUser2)}> {game.nameUser2} </p>
                  </div>
                  <div>
                    <p className="Main-container-winnerUser"> {this.drawMark(game.statusUser2)} </p>
                  </div>
                </div>

                <div>
                </div>

              <div id="Main-timer-game">
                <span>{DataService.dateFormatted(Math.round(game.timer/60/60))} : </span>
                <span>{DataService.dateFormatted(Math.round(game.timer/60))} : </span>
                <span>{DataService.dateFormatted(game.timer%60)} </span>
              </div>
              </div>
            ))}
          </div>

        </form>

        <button className="Main-button" onClick={this.addNewGame.bind(this)}> + </button>
      </div>
    );
  }
}

export default Main;
