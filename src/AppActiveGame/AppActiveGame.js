import React from 'react';
import './AppActiveGame.css';
import GamesService from '../GamesService.js';
import DataService  from '../DataService.js';
import LogicGame    from './LogicGame.js';
import GamesList    from '../GamesList.js';
import ZeroImg      from './zero.jpg';
import CrossImg     from './cross.jpg';
import { Redirect } from 'react-router-dom';

class AppActiveGame extends React.Component {

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
    if (game.statusGame === "AppMain-start-game") {

      if ((game.nameUser1 === this.state.nameUser) &&
          (game.statusUser1 === 1) &&
          (game.fieldsGame[i][j] === 0)) {

        game.statusGame       = "AppMain-play-game";
        game.fieldsGame[i][j] = 1;
        game.statusUser1      = 0;
        game.statusUser2      = 1;

        GamesService.saveGames(this.state.games);

        this.timerId = setInterval( () => this.incrementTimerGame(), 1000 );
      }
    }
    else {
      if (game.statusGame === "AppMain-play-game") {

        if ((game.nameUser1 === this.state.nameUser) &&
            (game.statusUser1 === 1) &&
            (game.fieldsGame[i][j] === 0)) {

          game.fieldsGame[i][j] = 1;

          if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
            game.statusUser1 = 2;
            game.statusGame  = "AppMain-over-game";
            game.timer       = this.state.valueTimer;
            clearInterval(this.timerId);
          }
          else {
            if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
              game.statusGame  = "AppMain-over-game";
              game.timer       = this.state.valueTimer;
              clearInterval(this.timerId);
            }
            else {
              game.statusUser1 = 0;
              game.statusUser2 = 1;
            }
          }

          GamesService.saveGames(this.state.games);
        }
        else {
          if ((game.nameUser2 === this.state.nameUser) &&
              (game.statusUser2 === 1)&&
              (game.fieldsGame[i][j] === 0)) {

            game.fieldsGame[i][j] = 2;

            if (LogicGame.checkWinner(game.fieldsGame, i, j)) {
              game.statusUser2 = 2;
              game.statusGame  = "AppMain-over-game";
              game.timer       = this.state.valueTimer;
              clearInterval(this.timerId);
            }
            else {
              if (!LogicGame.checkEmpty(game.fieldsGame, i, j)) {
                game.statusGame  = "AppMain-over-game";
                game.timer       = this.state.valueTimer;
                clearInterval(this.timerId);
              }
              else {
                game.statusUser1 = 1;
                game.statusUser2 = 0;
              }
            }

            GamesService.saveGames(this.state.games);
          }
        }
      }
    }
  }

  paintCell(field) {
    if (field === 0) { return "AppActiveGame-field"; }
    else {
      if (field === 1) { return "AppActiveGame-cross-field"; }
      else { return "AppActiveGame-zero-field"; }
    }
  }

  namePlayer(numUser, statusUser) {
    if ( (numUser === 1)&&(statusUser === 1) ) {
      return "AppActiveGame-container-nameUser1 AppActiveGame-container-activeUser";
    }
    else {
      if (numUser === 1) {
        return "AppActiveGame-container-nameUser1";
      }
      else {
        if (statusUser === 1) {
          return "AppActiveGame-container-nameUser2 AppActiveGame-container-activeUser";
        }
        else { return "AppActiveGame-container-nameUser2"; }
      }
    }
  }

  showTimer(game) {
    if ((game.nameUser1 === this.state.nameUser) && (game.statusGame === "AppMain-play-game")) {
      game.timer = this.state.valueTimer;
      GamesService.saveGames(this.state.games);
    }
    let value = DataService.dateFormatted(Math.round(game.timer/60/60)) + ":" +
                DataService.dateFormatted(Math.round(game.timer/60)) + ":" +
                DataService.dateFormatted(game.timer%60);
    return value;
  }

  setRedirect(game) {
    if ( (game.statusGame === "AppMain-play-game") && (this.state.nameUser === game.nameUser1) ) {
      game.statusUser2 = 2;
      game.statusGame  = "AppMain-over-game";
      game.timer       = this.state.valueTimer;
      GamesService.saveGames(this.state.games);

      clearInterval(this.timerId);
    }
    else {
      if ( (game.statusGame === "AppMain-play-game") && (this.state.nameUser === game.nameUser2) ) {
        game.statusUser1 = 2;
        game.statusGame  = "AppMain-over-game";
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
    if (!games) { games = []; }

    let nameUser     = this.state.nameUser;
    let idChooseGame = this.state.idGame;
    let chooseGame   = games.filter(function(game) {
                                    return game.id === idChooseGame});
    if (!chooseGame) { chooseGame = {}; };

    const {redirect} = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="AppActiveGame">
        <div className="AppActiveGame-header">
          Tic Tac Toe
        </div>

        <form id="AppActiveGame-container">

          {chooseGame.map(game => (
            <div key={(game.id)}>
              <label id="AppActiveGame-container-nameUser">
                <p className={this.namePlayer(1, game.statusUser1)}> {game.nameUser1} <img src={CrossImg} width="15" height="15" /> </p>
                <p className={this.namePlayer(2, game.statusUser2)}> <img src={ZeroImg} width="15" height="15" /> {game.nameUser2} </p>
              </label>

              <div>
                <div id="AppActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[0][0])} onClick={this.setCell.bind(this, game, 0, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[0][1])} onClick={this.setCell.bind(this, game, 0, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[0][2])} onClick={this.setCell.bind(this, game, 0, 2)}>
                  </div>
                </div>
                <div id="AppActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[1][0])} onClick={this.setCell.bind(this, game, 1, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[1][1])} onClick={this.setCell.bind(this, game, 1, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[1][2])} onClick={this.setCell.bind(this, game, 1, 2)}>
                  </div>
                </div>
                <div id="AppActiveGame-fields-container">
                  <div className={this.paintCell(game.fieldsGame[2][0])} onClick={this.setCell.bind(this, game, 2, 0)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[2][1])} onClick={this.setCell.bind(this, game, 2, 1)}>
                  </div>
                  <div className={this.paintCell(game.fieldsGame[2][2])} onClick={this.setCell.bind(this, game, 2, 2)}>
                  </div>
                </div>
              </div>

              <div id="AppActiveGame-container-timer">
                {this.showTimer(game)}
              </div>

              {(game.statusGame === "AppMain-play-game") && (
                <button className="AppActiveGame-button" onClick={this.setRedirect.bind(this, game)}> SURRENDER </button>
              )}

              {((game.statusGame === "AppMain-create-game") ||
                (game.statusGame === "AppMain-start-game")  ||
                (game.statusGame === "AppMain-over-game"))  && (
                <button className="AppActiveGame-button" onClick={this.setRedirect.bind(this, game)}> BACK </button>
              )}

            </div>
          ))}
        </form>
      </div>
    );
  }
}

export default AppActiveGame;
