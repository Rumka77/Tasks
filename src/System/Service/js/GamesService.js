class GamesService {

  static getGames() {
    return JSON.parse(localStorage.getItem("games"));
  }

  static saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games));
  }

  static deleteItems(mass, index, delCount) {
    mass.splice(index, delCount);
  }

}
export default GamesService;
