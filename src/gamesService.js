class gamesService {

  static getGames() {
    return JSON.parse(localStorage.getItem("games"));
  }

  static saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games))
  }

}
export default gamesService;
