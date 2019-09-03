import React from 'react';
import '../css/ActiveGame.css';
import GamesService from '../../../System/Service/js/GamesService.js';
import DataService  from '../../../System/Service/js/DataService.js';
import LogicGame    from './LogicGame.js';
import ZeroImg      from '../pict/zero.jpg';
import CrossImg     from '../pict/cross.jpg';
import Header       from '../../../System/Themes/js/Header.js';
import { Redirect } from 'react-router-dom';

const STATUS_USER_DEFAULT = 0;
const STATUS_USER_WAITING = 1;
const STATUS_USER_WINNER  = 2;

const STATUS_GAME_CREATE  = "Create-game";
const STATUS_GAME_START   = "Start-game";
const STATUS_GAME_PLAY    = "Play-game";
const STATUS_GAME_OVER    = "Over-game";

class ActiveGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games       : GamesService.getGames(),
      chooseGame  : [],
      redirect    : false,
      nameUser    : this.props.match.params.nameUser,
      idGame      : this.props.match.params.idGame,
      valueTimer  : 0,
    };
  }

  incrementTimerGame() {
    this.setState({valueTimer: this.state.valueTimer + 1});
    //this.setState({games: GamesService.getGames()});
  }

  setCell(game, i, j) {
    if (game.statusGame === STATUS_GAME_START) {

      if ((game.nameUser1 === this.state.nameUser) &&
          (game.statusUser1 === STATUS_USER_WAITING) &&
          (game.fieldsGame[i][j] === 0)) {

        game.statusGame       = STATUS_GAME_PLAY;
        game.fieldsGame[i][j] = 1;
        game.statusUser1      = STATUS_USER_DEFAULT;
        game.statusUser2      = STATUS_USER_WAITING;

        GamesService.saveGames(this.state.games);

        this.timerId = setInterval( () => this.incrementTimerGame(), 1000 );
      }
    }
    else {
      if (game.statusGame === STATUS_GAME_PLAY) {

        if ((game.nameUser1 === this.state.nameUser) &&
            (game.statusUser1 === STATUS_USER_WAITING) &&
            (game.fieldsGame[i][j] === 0)) {

          game.fieldsGame[i][j] = 1;

          if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
            game.statusUser1 = STATUS_USER_WINNER;
            game.statusGame  = STATUS_GAME_OVER;
            clearInterval(this.timerId);
          }
          else {
            if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
              game.statusGame  = STATUS_GAME_OVER;
              clearInterval(this.timerId);
            }
            else {
              game.statusUser1 = STATUS_USER_DEFAULT;
              game.statusUser2 = STATUS_USER_WAITING;
            }
          }

          GamesService.saveGames(this.state.games);
        }
        else {
          if ((game.nameUser2 === this.state.nameUser) &&
              (game.statusUser2 === STATUS_USER_WAITING)&&
              (game.fieldsGame[i][j] === 0)) {

            game.fieldsGame[i][j] = 2;

            if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
              game.statusUser2 = STATUS_USER_WINNER;
              game.statusGame  = STATUS_GAME_OVER;
              clearInterval(this.timerId);
            }
            else {
              if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
                game.statusGame  = STATUS_GAME_OVER;
                clearInterval(this.timerId);
              }
              else {
                game.statusUser1 = STATUS_USER_WAITING;
                game.statusUser2 = STATUS_USER_DEFAULT;
              }
            }

            GamesService.saveGames(this.state.games);
          }
        }
      }
    }
  }

  paintCell(field) {
    if (field === 0) {
      return "ActiveGame-field";
    }
    else {
      if (field === 1) {
        return "ActiveGame-cross-field";
      }
      else {
        return "ActiveGame-zero-field";
      }
    }
  }

  namePlayer(numUser, statusUser) {
    if ( (numUser === 1)&&(statusUser === STATUS_USER_WAITING) ) {
      return "ActiveGame-container-nameUser1 ActiveGame-container-activeUser";
    }
    else {
      if (numUser === 1) {
        return "ActiveGame-container-nameUser1";
      }
      else {
        if (statusUser === STATUS_USER_WINNER) {
          return "ActiveGame-container-nameUser2 ActiveGame-container-activeUser";
        }
        else {
          return "ActiveGame-container-nameUser2";
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
      game.timer       = this.state.valueTimer;
      GamesService.saveGames(this.state.games);

      clearInterval(this.timerId);
    }
    else {
      if ( (game.statusGame === STATUS_GAME_PLAY) && (this.state.nameUser === game.nameUser2) ) {
        game.statusUser1 = STATUS_USER_WINNER;
        game.statusGame  = STATUS_GAME_OVER;
        game.timer       = this.state.valueTimer;
        GamesService.saveGames(this.state.games);

        clearInterval(this.timerId);
      };
    };

    this.setState({
      redirect : true,
    });
  }

  updateScreen() {
    this.setState({games: GamesService.getGames()});
  }

  componentDidMount() {
    this.screenId = setInterval( () => this.updateScreen(), 1000 );
  }

  componentWillUnmount() {
    clearInterval(this.screenId);
  }

  render() {
    let games = this.state.games;
    if (!games) {
      games = [];
    }

    let nameUser     = this.state.nameUser;
    let idChooseGame = this.state.idGame;
    let chooseGame   = games.filter(function(game) {
                                    return game.id === idChooseGame});
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
                <p className={this.namePlayer(1, game.statusUser1)}> {game.nameUser1} <img src={CrossImg} width="15" height="15" /> </p>
                <p className={this.namePlayer(2, game.statusUser2)}> <img src={ZeroImg} width="15" height="15" /> {game.nameUser2} </p>
              </label>

              <div>
                <div id="ActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[0][0])} onClick={this.setCell.bind(this, game, 0, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[0][1])} onClick={this.setCell.bind(this, game, 0, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[0][2])} onClick={this.setCell.bind(this, game, 0, 2)}>
                  </div>
                </div>
                <div id="ActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[1][0])} onClick={this.setCell.bind(this, game, 1, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[1][1])} onClick={this.setCell.bind(this, game, 1, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[1][2])} onClick={this.setCell.bind(this, game, 1, 2)}>
                  </div>
                </div>
                <div id="ActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[2][0])} onClick={this.setCell.bind(this, game, 2, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[2][1])} onClick={this.setCell.bind(this, game, 2, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[2][2])} onClick={this.setCell.bind(this, game, 2, 2)}>
                  </div>
                </div>
              </div>

              <div id="ActiveGame-container-timer">
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
