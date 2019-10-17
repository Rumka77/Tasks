class LogicGame {

  static checkEmpty(fieldsGame, x, y) {
    let result = false;
    for (let i = 0; i < fieldsGame[x].length; i++) {
      let emptyCells = fieldsGame[i].filter(function(field) {
                                              return field === 0;
                                            });
      if (emptyCells.length > 0) {
        result = true;
        break;
      }
    }
    return result;
  }

  static checkGorizontal(fieldsGame, x, y) {
    let filledLine = false;
    let filledCells = fieldsGame[x].filter(function(field) {
                                             return field === fieldsGame[x][y];
                                           });
    if (fieldsGame[x].length === filledCells.length) {
      filledLine = true;
    }
    return (filledLine);
  }

  static getColumn(array, column) {
    let columnArray = [];
    for (var i = 0; i <= array.length-1; i++) {
      columnArray.push(array[i][column]);
    }
    return (columnArray);
  }

  static checkVertical(fieldsGame, x, y) {
    let filledLine = false;
    let column = this.getColumn(fieldsGame, y);
    let filledCells = column.filter(function(field) {
                                      return field === fieldsGame[x][y];
                                    });
    if (fieldsGame[x].length === filledCells.length) {
      filledLine = true;
    }
    return (filledLine);
  }

  static checkLeftDiagonal(array, x, y) {
    let filledLine = false;
    let leftDiagonalArray = [];
    for (var i = 0; i <= array.length-1; i++) {
      leftDiagonalArray.push(array[i][i]);
    }
    let filledCells = leftDiagonalArray.filter(function(field) {
                                                 return field === array[x][y];
                                               });
    if (array[x].length === filledCells.length) {
      filledLine = true;
    }
    return (filledLine);
  }

  static checkRightDiagonal(array, x, y) {
    let filledLine = false;
    let rightDiagonalArray = [];
    for (var i = 0; i <= array.length-1; i++) {
      rightDiagonalArray.push(array[i][array.length-1-i]);
    }
    let filledCells = rightDiagonalArray.filter(function(field) {
                                                  return field === array[x][y];
                                                });
    if (array[x].length === filledCells.length) {
      filledLine = true;
    }
    return (filledLine);
  }

  static checkWinner(fieldsGame, x, y) {
    let result = true;
    if (this.checkGorizontal(fieldsGame, x, y)) {
      result = true;
    }
    else {
      if (this.checkVertical(fieldsGame, x, y)) {
        result = true;
      }
      else {
        if ((x === y) && (this.checkLeftDiagonal(fieldsGame, x, y))) {
          result = true;
        }
        else {
          if (this.checkRightDiagonal(fieldsGame, x, y)) {
            result = true;
          }
          else {
            result = false;
          };
        };
      }
    }
    return result;
  }

}
export default LogicGame;
