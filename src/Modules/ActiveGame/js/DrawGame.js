import ZeroImg      from '../pict/zero.jpg';
import ZeroImg_view from '../pict/zero_view.jpg';

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
    let result = "";
    if (this.viewMode(game, nameUser)) {
      result = result + "ActiveGame-field-view";
      if (field === CROSS_IN_FIELD) {
        result = result + " ActiveGame-cross-field";
      }
      else {
        if (field === ZERO_IN_FIELD) {
          result = result + " ActiveGame-zero-view-field";
        }
      }
    }
    else {
      result = result + "ActiveGame-field";
      if (field === CROSS_IN_FIELD) {
        result = result + " ActiveGame-cross-field";
      }
      else {
        if (field === ZERO_IN_FIELD) {
          result = result + " ActiveGame-zero-field";
        }
      }
    }
    return result;
  }

  static cssNamePlayer(numberUser, statusUser, nameUser, game) {
    let result = "";
    if ( (numberUser === 1) && (statusUser === STATUS_USER_WAITING) ) {
      result = "ActiveGame-container-nameUser1 ActiveGame-container-activeUser";
    }
    else {
      if (numberUser === 1) {
        result = result + "ActiveGame-container-nameUser1";
      }
      else {
        if (statusUser === STATUS_USER_WAITING) {
          result = result +
            "ActiveGame-container-nameUser2 ActiveGame-container-activeUser";
        }
        else {
          result = result + "ActiveGame-container-nameUser2";
        }
      }
    }
    if ( (game.statusGame === STATUS_GAME_OVER) ||
         ((game.nameUser1 !== nameUser) && (game.nameUser2 !== nameUser)) ) {
      result = result + " ActiveGame-viewMode";
    }
    return result;
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
    let result = "ActiveGame-container-timer";
    if (this.viewMode(game, nameUser)) {
      result = result + " ActiveGame-viewMode";
    }
    return result;
  }

}
export default DrawGame;

const STATUS_USER_WAITING = 1;

const STATUS_GAME_OVER    = "Over-game";

const CROSS_IN_FIELD      = 1;
const ZERO_IN_FIELD       = 2;
