class GamesService {

  static getGames() {
    return JSON.parse(localStorage.getItem("games"));
  }

  static saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games));
  }

  static deleteItems(mass, index, delCount) {
    mass.slice(index, delCount);
    //console.dir(index+" "+delCount+" "+mass[index]);
  }

}
export default GamesService;
