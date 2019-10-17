import React from 'react';
import '../css/Main.css';
import GamesService  from '../../../System/Service/js/GamesService.js';
import DataService   from '../../../System/Service/js/DataService.js';
import Header        from '../../../System/Themes/js/Header.js';
import { Redirect }  from 'react-router-dom';

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
      this.setState({
        games: GamesService.getGames(),
      });
    }
    else {
      alert ("Неверное имя пользователя!")
    }
  }

  namePlayer(numberUser, statusUser) {
    if ( ((numberUser === 1) && (statusUser === STATUS_USER_WINNER)) ||
         ((numberUser === 2) && (statusUser === STATUS_USER_WINNER)) ) {

      return "Main-container-winnerUser";
    }
  }

  drawMark(statusUser) {
    let result = "";
    if (statusUser === STATUS_USER_WINNER) {
      result = DRAW_MARK;
    }
    return result;
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
      this.setState({
        games: GamesService.getGames(),
      });
    }

    this.setState({
      active   : game.id,
      redirect : true,
    });
  }

  deleteOldGames(games) {
    let changed = false;
    for (let i = 0; i < games.length; i++) {
      if ( (DataService.dateNowToStr() !==
            DataService.idToDateStr(games[i].id)) ||
           ((games[i].statusGame === STATUS_GAME_CREATE) &&
            (DataService.timeNowSec() -
             DataService.idToTimeSec(games[i].id) > 900)) ) {

        if (!changed) {
          changed = true;
        }
        GamesService.deleteItems(games, i, 1);
      };
    };
    if (changed) {
      GamesService.saveGames(this.state.games);
    }
  };

  updateScreen() {
    this.setState({
      games : GamesService.getGames(),
    });
  }

  componentDidMount() {
    this.screenId = setInterval( () => this.updateScreen(), 1000 );
  }

  componentWillUnmount() {
    clearInterval(this.screenId);
  }

  render() {
    this.deleteOldGames(this.state.games);
    let games = this.state.games;
    if (!games) {
      games = [];
    }

    let activeGame = games.find(game => game.id === this.state.active);
    if (!activeGame) {
      activeGame = {};
    }

    const {redirect} = this.state;
    if (redirect && this.nameUser.value) {
      return <Redirect to={"/ActiveGame/js/" + this.nameUser.value + "/" +
              activeGame.id+ "/" + activeGame.statusGame} />;
    }

    return (
      <div className="Main">
        <Header />

        <form className="Main-listGames" id="Main-container">
          <div className="Main-div-input_text">
            <input type="text" className="Main-input_text" name="nameUser"
                   ref={el=>this.nameUser=el}
            />
          </div>
          <div id="Main-games-container">
            {games.map(game => (
              <div key={(game.id)} className={(game.statusGame)}
                   onClick={this.setRedirect.bind(this, game)}>
                <div id="Main-user1">
                  <div>
                    <p className={this.namePlayer(1, game.statusUser1)}>
                       {game.nameUser1 }
                    </p>
                  </div>
                  <div>
                    <p className="Main-container-winnerUser">
                       {this.drawMark(game.statusUser1)}
                    </p>
                  </div>
                </div>

                <div id="Main-user2">
                  <div>
                    <p className={this.namePlayer(2, game.statusUser2)}>
                      {game.nameUser2}
                    </p>
                  </div>
                  <div>
                    <p className="Main-container-winnerUser">
                      {this.drawMark(game.statusUser2)}
                    </p>
                  </div>
                </div>

                <div id="Main-timer-game">
                  <span>
                    {DataService.dateFormatted(Math.round(game.timer/60/60))}:
                  </span>
                  <span>
                    {DataService.dateFormatted(Math.round(game.timer/60))}:
                  </span>
                  <span>
                    {DataService.dateFormatted(game.timer%60)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="Main-div-button">
          <button className="Main-button" onClick={this.addNewGame.bind(this)}>
            +
          </button>
        </div>
      </div>
    );
  }
}

export default Main;

const STATUS_USER_DEFAULT = 0;
const STATUS_USER_WAITING = 1;
const STATUS_USER_WINNER  = 2;

const STATUS_GAME_CREATE  = "Create-game";
const STATUS_GAME_START   = "Start-game";

const DRAW_MARK = String.fromCharCode(10003);
