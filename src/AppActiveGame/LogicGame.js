class LogicGame {

  static checkEmpty(fieldsGame, x, y) {
    let res = false;
    for (let i = 0; i < fieldsGame[x].length; i++) {
      let emptyCells = fieldsGame[i].filter(function(field) { return field === 0 });
      if (emptyCells.length > 0) {
        res = true;
        break;
      }
    }
    return res;
  }

  static checkGorizontal(fieldsGame, x, y) {
    let filledLine = false;
    let filledCells = fieldsGame[x].filter(function(field) {
                                           return field === fieldsGame[x][y]});
    if (fieldsGame[x].length === filledCells.length) { filledLine = true; }
    return (filledLine);
  }

  static getColumn(massiv, col) {
    let colMassiv = [];
    for (var i = 0; i <= massiv.length-1; i++) {
      colMassiv.push(massiv[i][col]);
    }
    return (colMassiv);
  }

  static checkVertical(fieldsGame, x, y) {
    let filledLine = false;
    let column = this.getColumn(fieldsGame, y);
    let filledCells = column.filter(function(field) {
                                    return field === fieldsGame[x][y]});
    if (fieldsGame[x].length === filledCells.length) { filledLine = true; }
    return (filledLine);
  }

  static checkLeftDiagonal(massiv, x, y) {
    let filledLine = false;
    let leftDiagMassiv = [];
    for (var i = 0; i <= massiv.length-1; i++) {
      leftDiagMassiv.push(massiv[i][i]);
    }
    let filledCells = leftDiagMassiv.filter(function(field) {
                                            return field === massiv[x][y]});
    if (massiv[x].length === filledCells.length) { filledLine = true; }
    return (filledLine);
  }

  static checkRightDiagonal(massiv, x, y) {
    let filledLine = false;
    let rightDiagMassiv = [];
    for (var i = 0; i <= massiv.length-1; i++) {
      rightDiagMassiv.push(massiv[i][massiv.length-1-i]);
    }
    let filledCells = rightDiagMassiv.filter(function(field) {
                                             return field === massiv[x][y]});
    if (massiv[x].length === filledCells.length) { filledLine = true; }
    return (filledLine);
  }

  static checkWinner(fieldsGame, x, y) {
    let res = true;
    if (this.checkGorizontal(fieldsGame, x, y)) { res = true; }
    else {
      if (this.checkVertical(fieldsGame, x, y)) { res = true; }
      else {
        if ((x===y) && (this.checkLeftDiagonal(fieldsGame, x, y))) { res = true; }
        else {
          if (this.checkRightDiagonal(fieldsGame, x, y)) { res = true; }
          else { res = false; };
        };
      }
    }
    return(res);
  }

}
export default LogicGame;
