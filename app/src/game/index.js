import { generateMap } from "./lib";
import { items } from "./data/items";

export default class Game {
  name = "Fun Game !";
  map = [];
  actionPlayer = null;
  select = null;
  items = items;
  width = 20;
  height = 20;
  players = ["Robin", "Coco", "Axel", "Clement", "Bigeard"];
  closeDialogWin = false;
  closeDialogInfo = false;

  constructor() {
    console.log("Start Game !");
    const { new_map, gen_player } = generateMap(
      this.width, // width
      this.height, // height
      this.players, // players
      40, // numObstacle
      6, // numItems
      this.items // items
    );
    this.map = new_map;
    this.players = gen_player;
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
    if (this.map[y][x].view_distance === "Distance") {
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
          console.log(index);
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
          if (this.players.length === 1) {
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
}
