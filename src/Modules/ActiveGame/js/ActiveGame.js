import React from 'react';
import '../css/ActiveGame.css';
import GamesService from '../../../System/Service/js/GamesService.js';
import DataService  from '../../../System/Service/js/DataService.js';
import LogicGame    from './LogicGame.js';
import DrawGame     from './DrawGame.js';
import CrossImg     from '../pict/cross.jpg';
import Header       from '../../../System/Themes/js/Header.js';
import { Redirect } from 'react-router-dom';

class ActiveGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games            : GamesService.getGames(),
      chooseGame       : [],
      redirect         : false,
      nameUser         : this.props.match.params.nameUser,
      idGame           : this.props.match.params.idGame,
      statusActiveGame : this.props.match.params.statusActiveGame,
      startTimer       : false,
      valueTimer       : 0,
    };
  }

  incrementTimerGame() {
    this.setState({
      valueTimer : this.state.valueTimer + 1,
      games      : GamesService.getGames(),
    });
  }

  startGame(game, i, j) {
    game.statusGame       = STATUS_GAME_PLAY;
    game.fieldsGame[i][j] = CROSS_IN_FIELD;
    game.statusUser1      = STATUS_USER_DEFAULT;
    game.statusUser2      = STATUS_USER_WAITING;
    GamesService.saveGames(this.state.games);

    clearInterval(this.screenId);
    this.timerId = setInterval( () => this.incrementTimerGame(), 1000 );
  }

  setCross(game, i, j) {
    game.fieldsGame[i][j] = CROSS_IN_FIELD;
    GamesService.saveGames(this.state.games);

    if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
      game.statusUser1 = STATUS_USER_WINNER;
      game.statusGame  = STATUS_GAME_OVER;
      game.timer       = this.state.valueTimer;
      GamesService.saveGames(this.state.games);

      clearInterval(this.timerId);
      this.updateScreen();
    }
    else {
      if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
        game.statusGame  = STATUS_GAME_OVER;
        game.timer       = this.state.valueTimer;
        GamesService.saveGames(this.state.games);

        clearInterval(this.timerId);
        this.updateScreen();
      }
      else {
        game.statusUser1 = STATUS_USER_DEFAULT;
        game.statusUser2 = STATUS_USER_WAITING;
        GamesService.saveGames(this.state.games);
      }
    }
  }

  setZero(game, i, j) {
    game.fieldsGame[i][j] = ZERO_IN_FIELD;
    GamesService.saveGames(this.state.games);

    if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
      game.statusUser2 = STATUS_USER_WINNER;
      game.statusGame  = STATUS_GAME_OVER;
      GamesService.saveGames(this.state.games);

      clearInterval(this.updateScreen);
    }
    else {
      if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
        game.statusGame  = STATUS_GAME_OVER;
        GamesService.saveGames(this.state.games);

        clearInterval(this.updateScreen);
      }
      else {
        game.statusUser1 = STATUS_USER_WAITING;
        game.statusUser2 = STATUS_USER_DEFAULT;
        GamesService.saveGames(this.state.games);
      }
    }
  }

  setCell(game, i, j) {
    if (game.statusGame === STATUS_GAME_START) {

      if ((game.nameUser1 === this.state.nameUser)   &&
          (game.statusUser1 === STATUS_USER_WAITING) &&
          (game.fieldsGame[i][j] === EMPTY_IN_FIELD)) {

        this.startGame(game, i, j);
      }
    }
    else {
      if (game.statusGame === STATUS_GAME_PLAY) {

        if ((game.nameUser1 === this.state.nameUser)   &&
            (game.statusUser1 === STATUS_USER_WAITING) &&
            (game.fieldsGame[i][j] === EMPTY_IN_FIELD)) {

          this.setCross(game, i, j);
        }
        else {
          if ((game.nameUser2 === this.state.nameUser)   &&
              (game.statusUser2 === STATUS_USER_WAITING) &&
              (game.fieldsGame[i][j] === EMPTY_IN_FIELD)) {

            this.setZero(game, i, j);      
          }
        }
      }
    }
  }

  showTimer(game) {
    if ((game.nameUser1 === this.state.nameUser) && (game.statusGame === STATUS_GAME_PLAY)) {
      game.timer = this.state.valueTimer;
      GamesService.saveGames(this.state.games);
    }
    let value = DataService.dateFormatted(Math.round(game.timer/60/60)) + ":" +
                DataService.dateFormatted(Math.round(game.timer/60)) + ":" +
                DataService.dateFormatted(game.timer%60);
    return value;
  }

  setRedirect(game) {
    if ( (game.statusGame === STATUS_GAME_PLAY) && (this.state.nameUser === game.nameUser1) ) {
      game.statusUser2 = STATUS_USER_WINNER;
      game.statusGame  = STATUS_GAME_OVER;
      GamesService.saveGames(this.state.games);
      clearInterval(this.timerId);
    }
    else {
      if ( (game.statusGame === STATUS_GAME_PLAY) && (this.state.nameUser === game.nameUser2) ) {
        game.statusUser1 = STATUS_USER_WINNER;
        game.statusGame  = STATUS_GAME_OVER;
        GamesService.saveGames(this.state.games);
        clearInterval(this.screenId);
      };
    };

    this.setState({
      redirect : true,
    });
  }

  updateScreen() {
    this.setState({
      games: GamesService.getGames(),
    });
  }

  componentDidMount() {
    if (this.state.statusActiveGame !== STATUS_GAME_OVER) {
      this.screenId = setInterval( () => this.updateScreen(), 1000 );
    }
  }

  componentWillUnmount() {
    if (this.state.statusActiveGame !== STATUS_GAME_OVER) {
      clearInterval(this.screenId);
    }
  }

  render() {
    let games = this.state.games;
    if (!games) {
      games = [];
    }

    let idChooseGame = this.state.idGame;
    let chooseGame   = games.filter(function(game) {
                                      return game.id === idChooseGame;
                                    });
    if (!chooseGame) {
      chooseGame = {};
    };

    const {redirect} = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="ActiveGame">

        <Header />

        <form id="ActiveGame-container">

          {chooseGame.map(game => (
            <div key={(game.id)}>
              <label id="ActiveGame-container-nameUser">
                <p className={DrawGame.cssNamePlayer(1, game.statusUser1, this.state.nameUser, game)}> {game.nameUser1} <img src={CrossImg} width="15" height="15" /> </p>
                <p className={DrawGame.cssNamePlayer(2, game.statusUser2, this.state.nameUser, game)}> <img src={DrawGame.namePlayer(game, this.state.nameUser)} width="15" height="15" /> {game.nameUser2} </p>
              </label>

              <div>
                <div id="ActiveGame-fields-container">
                  <div className={DrawGame.paintCell(game.fieldsGame[0][0], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 0, 0)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[0][1], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 0, 1)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[0][2], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 0, 2)}>
                  </div>
                </div>
                <div id="ActiveGame-fields-container">
                  <div className={DrawGame.paintCell(game.fieldsGame[1][0], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 1, 0)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[1][1], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 1, 1)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[1][2], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 1, 2)}>
                  </div>
                </div>
                <div id="ActiveGame-fields-container">
                  <div className={DrawGame.paintCell(game.fieldsGame[2][0], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 2, 0)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[2][1], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 2, 1)}>
                  </div>
                  <div className={DrawGame.paintCell(game.fieldsGame[2][2], game, this.state.nameUser)} onClick={this.setCell.bind(this, game, 2, 2)}>
                  </div>
                </div>
              </div>

              <div className={DrawGame.cssTimer(game, this.state.nameUser)}>
                {this.showTimer(game)}
              </div>

              {(game.statusGame === STATUS_GAME_PLAY) && (
                <button className="ActiveGame-button" onClick={this.setRedirect.bind(this, game)}> SURRENDER </button>
              )}

              {((game.statusGame === STATUS_GAME_CREATE) ||
                (game.statusGame === STATUS_GAME_START)  ||
                (game.statusGame === STATUS_GAME_OVER))  && (
                <button className="ActiveGame-button" onClick={this.setRedirect.bind(this, game)}> BACK </button>
              )}

            </div>
          ))}
        </form>
      </div>
    );
  }
}

export default ActiveGame;

const STATUS_USER_DEFAULT = 0;
const STATUS_USER_WAITING = 1;
const STATUS_USER_WINNER  = 2;

const STATUS_GAME_CREATE  = "Create-game";
const STATUS_GAME_START   = "Start-game";
const STATUS_GAME_PLAY    = "Play-game";
const STATUS_GAME_OVER    = "Over-game";

const EMPTY_IN_FIELD      = 0;
const CROSS_IN_FIELD      = 1;
const ZERO_IN_FIELD       = 2;
