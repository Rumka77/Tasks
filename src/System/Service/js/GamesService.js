class GamesService {

  static getGames() {
    return JSON.parse(localStorage.getItem("games"));
  }

  static saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games));
  }

  static deleteItems(array, index, deleteCount) {
    array.splice(index, deleteCount);
  }

}
export default GamesService;
