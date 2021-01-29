import axios from "axios";

export default class Game {
  _id = "";
  code = "";
  name = "";
  map = [];
  actionPlayer = null;
  select = null;
  items = [];
  players = [];
  user = null;
  width = 20;
  height = 20;
  closeDialogWin = false;
  closeDialogInfo = false;

  constructor(vue) {
    this.loadGame(vue);
  }

  /**
   * The function allows to load the game by searching in IndexedDB
   * @param {*} vue Vue component
   */
  async loadGame(vue) {
    let game = await axios
      .post("https://dino-srv.azurewebsites.net/api/game/readByCode", {
        code: vue.$route.params.code
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error(error);
      });

    if (game && game._id) {
      this._id = game._id;
      this.code = game.code;
      this.name = game.name;
      this.map = game.map;
      this.players = game.players;
      this.closeDialogWin = game.closeDialogWin;
      // Update or Create in indexedDB
      const exist = await vue.$db.game.get({ _id: game._id });
      if (exist && exist._id) await vue.$db.game.update(this._id, game);
      else await vue.$db.game.add(game);

      if (
        game.damage &&
        game.damage.x &&
        game.damage.y &&
        game.damage.totalDamage
      ) {
        this.playerDamage(
          document.querySelector(
            `[x="${game.damage.x}"][y="${game.damage.y}"]`
          ),
          game.damage.totalDamage
        );
      }
    } else {
      // Offline Game
      const game_db = await vue.$db.game.get({ code: vue.$route.params.code });
      if (game_db && game_db._id) {
        this._id = game_db._id;
        this.code = game_db.code;
        this.name = game_db.name;
        this.map = game_db.map;
        this.players = game_db.players;
        this.closeDialogWin = game_db.closeDialogWin;
      } else {
        vue.$router.push("/error");
      }
    }
    this.centerToUserPlayer(vue);
  }

  /**
   * The function center the window to player
   * @param {*} vue Vue component
   */
  async centerToUserPlayer(vue) {
    this.user = await vue.$db.user.get({ id: 0 });
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        if (this.map[y][x].obj && this.map[y][x].obj._id === this.user._id) {
          // Center player
          const nodePlayer = document.querySelector(`[x="${x}"][y="${y}"]`);
          nodePlayer.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });

          // If turn of player
          if (this.user._id === this.players[0]._id) {
            const accessible = this.accessibleCellsAround(
              x,
              y,
              this.map[y][x].obj.stat.move
            );
            accessible.forEach(e => {
              if (!e.obj || e.obj.name != this.map[y][x].obj.name) {
                this.map[e.y][e.x].view_distance = "Distance";
              }
            });
            this.actionPlayer = this.map[y][x];
          }
        }
      }
    }
  }

  /**
   * The function allow user action to be intercepted.
   * @param {Number} x Position of cell X
   * @param {Number} y Position of cell Y
   */
  async actionGame(vue, x, y, e) {
    this.select = this.map[y][x];
    // if the cell is currently in movement / distance selection
    if (
      this.map[y][x].view_distance === "Distance" &&
      this.actionPlayer.obj &&
      this.players[0] &&
      this.user &&
      this.players[0]._id === this.actionPlayer.obj._id &&
      this.user._id === this.actionPlayer.obj._id
    ) {
      if (this.map[y][x].name === "Player") {
        const totalDamage = this.calcTotalDamage(this.actionPlayer.obj);
        this.map[y][x].obj.stat.health =
          this.map[y][x].obj.stat.health - totalDamage;

        this.playerDamage(e.target, totalDamage);

        const index = this.players
          .map(e => e.name)
          .indexOf(this.map[y][x].obj.name);
        this.players[index] = this.map[y][x].obj;

        // Detect if the player has no more health
        if (this.map[y][x].obj.stat.health <= 0) {
          if (index > -1) {
            this.players[index].dead = true;
            this.players[index].health = 0;
          }

          this.map[y][x] = {
            name: "Ground",
            x: x,
            y: y,
            obstacle: false,
            view_distance: null
          };

          // If he is the last player, he has won!
          if (
            this.players.map(e => e.dead).filter(e => e === false).length === 1
          ) {
            this.closeDialogWin = true;
          }
        }
      } else {
        // Player change position
        this.map[this.actionPlayer.y][this.actionPlayer.x] = {
          name: "Ground",
          x: this.actionPlayer.x,
          y: this.actionPlayer.y,
          obstacle: false,
          view_distance: null
        };
        this.actionPlayer.x = x;
        this.actionPlayer.y = y;

        if (this.map[y][x].name === "Item") {
          this.actionPlayer.obj.items.push(this.map[y][x].obj);
        }
        this.map[y][x] = this.actionPlayer;
      }
      this.resetDistance();
      this.changeTurn();

      const new_game = await axios
        .post("https://dino-srv.azurewebsites.net/api/game/action", {
          passId: this.user.pass_id,
          code: vue.$route.params.code,
          x: x,
          y: y
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.error(error);
        });
      if (new_game && new_game.name && new_game.map && new_game.players) {
        this.name = new_game.name;
        this.map = new_game.map;
        this.players = new_game.players;
        this.closeDialogWin = new_game.closeDialogWin;
      }
      await vue.$db.game.update(this._id, {
        name: this.name,
        map: this.map,
        players: this.players,
        closeDialogWin: this.closeDialogWin
      });
    } else if (this.map[y][x].name === "Player") {
      // Click on Player
      this.resetDistance();
      this.actionPlayer = null;
      const accessible = this.accessibleCellsAround(
        x,
        y,
        this.map[y][x].obj.stat.move
      );
      accessible.forEach(e => {
        if (!e.obj || e.obj.name != this.map[y][x].obj.name) {
          this.map[e.y][e.x].view_distance = "Distance";
        }
      });
      this.actionPlayer = this.map[y][x];
    } else if (this.map[y][x].name === "Ground") {
      // Click on Ground
      this.resetDistance();
      this.actionPlayer = null;
    }
  }

  calcTotalDamage(obj) {
    // Calculate damage with items
    let itemsDamage = 0;
    if (!obj.items) return obj.stat.damage;
    obj.items.forEach(i => {
      itemsDamage += i.stat.damage;
    });
    // Inflicts damage
    return obj.stat.damage + itemsDamage;
  }

  /**
   * Displays the distance and the cells that the user can travel.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} move The distance the player can travel
   * @param {Set} existingSet
   */
  accessibleCellsAround(x, y, move, existingSet) {
    if (move == 0) {
      return existingSet;
    }
    if (!existingSet) {
      existingSet = new Set([]);
    }
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ];
    for (const dir of directions) {
      const target = { x: x + dir.x, y: y + dir.y };
      if (this.cellIsWalkable(target.x, target.y)) {
        existingSet.add(this.map[target.y][target.x]);
        this.accessibleCellsAround(target.x, target.y, move - 1, existingSet);
      }
    }
    return existingSet;
  }

  cellIsWalkable(x, y) {
    if (x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length) {
      return false;
    }
    return !this.map[y][x].obstacle;
  }

  resetDistance() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        this.map[y][x].view_distance = null;
      }
    }
  }

  playerDamage(node, totalDamage) {
    // Annimation of total damage
    node.innerHTML = "-" + totalDamage;
    node.style.backgroundImage = "none";
    node.style.fontWeight = "bold";
    node.style.padding = "0";

    setTimeout(() => {
      node.style.backgroundImage = null;
      node.style.padding = null;
      node.style.fontWeight = null;
      node.innerHTML = "";
    }, 1000);
  }

  changeTurn() {
    this.players.splice(this.players.length, 0, this.players.splice(0, 1)[0]);
    if (this.players[0].dead) {
      this.changeTurn();
    }
  }
}
