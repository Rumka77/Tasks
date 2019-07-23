class AppAddNewGame {

  static addNewGame() {
    let newGame = {
      id          : String((new Date()).getFullYear())+String((new Date()).getMonth()+1)+String((new Date()).getDate()),
      statusGame  : "App-create-game",
      timer       : "00:00:00",
      nameUser1   : this.userName.value,
      statusUser1 : 0,
      nameUser2   : "",
      statusUser2 : 0,
      filedsGame  : [[0,0,0], [0,0,0], [0,0,0]]
    }

    this.props.saveNewGame(newGame);
  }

}
export default AppAddNewGame;
