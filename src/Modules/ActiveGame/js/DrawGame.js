import ZeroImg      from '../pict/zero.jpg';
import ZeroImg_view from '../pict/zero_view.jpg';

const STATUS_USER_WAITING = 1;

const STATUS_GAME_OVER    = "Over-game";

const CROSS_IN_FIELD      = 1;
const ZERO_IN_FIELD       = 2;

class DrawGame {

  static viewMode(game, nameUser) {
    if ( (game.statusGame === STATUS_GAME_OVER) ||
         ((game.nameUser1 !== nameUser) &&
          (game.nameUser2 !== nameUser)) ) {
      return true;
    }
    else {
      return false;
    }
  }

  static paintCell(field, game, nameUser) {
    let res = "";
    if (this.viewMode(game, nameUser)) {
      res = res + "ActiveGame-field-view";
      if (field === CROSS_IN_FIELD) {
        res = res + " ActiveGame-cross-field";
      }
      else {
        if (field === ZERO_IN_FIELD) {
          res = res + " ActiveGame-zero-view-field";
        }
      }
    }
    else {
      res = res + "ActiveGame-field";
      if (field === CROSS_IN_FIELD) {
        res = res + " ActiveGame-cross-field";
      }
      else {
        if (field === ZERO_IN_FIELD) {
          res = res + " ActiveGame-zero-field";
        }
      }
    }
    return res;
  }

  static cssNamePlayer(numUser, statusUser, nameUser, game) {
    let res = "";
    if ( (numUser === 1) && (statusUser === STATUS_USER_WAITING) ) {
      res = "ActiveGame-container-nameUser1 ActiveGame-container-activeUser";
    }
    else {
      if (numUser === 1) {
        res = res + "ActiveGame-container-nameUser1";
      }
      else {
        if (statusUser === STATUS_USER_WAITING) {
          res = res + "ActiveGame-container-nameUser2 ActiveGame-container-activeUser";
        }
        else {
          res = res + "ActiveGame-container-nameUser2";
        }
      }
    }
    if ( (game.statusGame === STATUS_GAME_OVER) ||
         ((game.nameUser1 !== nameUser) && (game.nameUser2 !== nameUser))) {
      res = res + " ActiveGame-viewMode";
    }
    return res;
  }

  static namePlayer(game, nameUser) {
    if (this.viewMode(game, nameUser)) {
      return ZeroImg_view;
    }
    else {
      return ZeroImg;
    }
  }

  static cssTimer(game, nameUser) {
    let res = "ActiveGame-container-timer";
    if (this.viewMode(game, nameUser)) {
      res = res + " ActiveGame-viewMode";
    }
    return res;
  }

}
export default DrawGame;
