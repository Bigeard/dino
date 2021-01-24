const items = require("./data/items");

export default class Game {
  name = "";
  map = [];
  actionPlayer = null;
  select = null;
  items = items;
  players = [];
  user = null;
  width = 20;
  height = 20;
  closeDialogWin = false;
  closeDialogInfo = false;

  constructor(vue) {
    console.log("Start Game !");
    this.loadGame(vue);
    this.centerToUserPlayer(vue);
  }

  /**
   * The function allows to load the game by searching in IndexedDB
   * @param {*} vue Vue component
   */
  async loadGame(vue) {
    const game = await vue.$db.game.get({
      code: vue.$route.params.code
    });
    if (game) {
      this.name = game.name;
      this.map = game.map;
      this.players = game.players;
      this.width = game.width;
      this.height = game.height;
    } else {
      vue.$router.push("/error");
    }
  }

  /**
   * The function center the window to player
   * @param {*} vue Vue component
   */
  async centerToUserPlayer(vue) {
    this.user = await vue.$db.user.get({ id: 0 });
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map.length; x++) {
        if (
          this.map[y][x].obj &&
          this.map[y][x].obj.name === this.user.username
        ) {
          const nodePlayer = document.querySelector(`[x="${x}"][y="${y}"]`);
          nodePlayer.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        }
      }
    }
  }

  /**
   * The function allow user action to be intercepted.
   * @param {Number} x Position of cell X
   * @param {Number} y Position of cell Y
   */
  actionGame(x, y, e) {
    this.select = this.map[y][x];
    console.log(`x: ${x} / y: ${y} - ${this.select.name}: `, this.select);

    // if the cell is currently in movement / distance selection
    if (
      this.map[y][x].view_distance === "Distance" &&
      this.players[0]._id === this.actionPlayer.obj._id
    ) {
      if (this.map[y][x].name === "Player") {
        const totalDamage = this.calcTotalDamage(this.actionPlayer.obj);
        this.map[y][x].obj.stat.health =
          this.map[y][x].obj.stat.health - totalDamage;

        // Annimation of total damage
        e.target.innerHTML = "-" + totalDamage;
        e.target.style.backgroundImage = "none";
        e.target.style.fontWeight = "bold";
        e.target.style.padding = "0";

        setTimeout(() => {
          e.target.style.backgroundImage = null;
          e.target.style.padding = null;
          e.target.style.fontWeight = null;
          e.target.innerHTML = "";
        }, 1000);

        // Detect if the player has no more health
        if (this.map[y][x].obj.stat.health <= 0) {
          const index = this.players
            .map(e => e.name)
            .indexOf(this.map[y][x].obj.name);

          if (index > -1) {
            this.players[index].dead = true;
          }

          this.map[y][x] = {
            name: "Ground",
            x: x,
            y: y,
            items: [],
            obstacle: false,
            view_distance: null
          };

          // If he is the last player, he has won!
          if (
            this.players.map(e => e.dead).filter(e => e === false).length === 1
          ) {
            this.closeDialogWin = true;
            console.log(this.actionPlayer.name + " WIN !!!");
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
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return !this.map[y][x].obstacle;
  }

  resetDistance() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.map[y][x].view_distance = null;
      }
    }
  }

  changeTurn() {
    this.players.splice(this.players.length, 0, this.players.splice(0, 1)[0]);
    if (this.players[0].dead) {
      this.changeTurn();
    }
  }
}