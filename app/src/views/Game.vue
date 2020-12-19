<template>
  <div class="game">
    <div class="option">
      <gb-button class="icon" @click="$router.push('/')" right-icon="home" />
      <b>{{ name }}</b>
      <gb-button class="icon" @click="$router.push('/')" right-icon="info" />
    </div>
    <div id="game">
      <table>
        <tr v-for="(row, y) in map" :key="y">
          <td
            v-for="(cell, x) in row"
            :key="x"
            :class="
              `cell 
              ${cell.id + 1 ? cell.name + (cell.id + 1) : cell.name}
              ${cell.obj ? 'obj' : ''}
              ${cell.view_distance ? ' ' + cell.view_distance : ''}`
            "
            @click="action"
            :y="y"
            :x="x"
          >
            {{ cell.obj ? cell.obj.icon : null }}
          </td>
        </tr>
      </table>

      <div
        :class="
          `info ${select.id + 1 ? select.name + (select.id + 1) : select.name}`
        "
        v-if="select && select.obj"
        @click="closeInfo"
      >
        <b>{{ select.name }} : {{ select.obj.name }}</b>
        <div class="info-obj">
          <div class="stat">
            <span>Stat</span>
            <span>- Dommage : {{ select.obj.stat.dommage }}</span>
            <span>- Move : {{ select.obj.stat.move }}</span>
          </div>
          <div class="view">
            <span>{{ select.obj.icon }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  data() {
    return {
      name: "Fun Game !",
      map: [],
      width: 20,
      height: 20,
      numPlayer: 5,
      numObstacle: 40,
      numItems: 6,
      movePlayer: null,
      select: null
    };
  },
  beforeMount() {
    this.initGame();
  },
  methods: {
    closeInfo() {
      this.select = null;
    },
    initGame() {
      console.log("Start Game !");
      // const numCell = this.width + this.height;
      for (let y = 0; y < this.height; y++) {
        this.map.push([]);
        for (let x = 0; x < this.width; x++) {
          this.map[y].push({
            name: "Ground",
            x: x,
            y: y,
            items: [],
            obstacle: false,
            view_distance: null
          });
        }
      }
      let randCell = null;
      const players = ["Robin", "Coco", "Axel", "Clement", "Bigeard"];
      for (let p = 0; p < this.numPlayer; p++) {
        randCell = this.map[this.randInt(0, this.height)][
          this.randInt(0, this.width)
        ];
        randCell.id = p;
        randCell.name = "Player";
        randCell.obstacle = true;
        randCell.obj = {
          name: players[p],
          icon: "🦖",
          stat: {
            dommage: 4,
            move: 3
          }
        };
      }
      for (let o = 0; o < this.numObstacle; o++) {
        randCell = this.map[this.randInt(0, this.height)][
          this.randInt(0, this.width)
        ];
        if (randCell.name === "Ground") {
          randCell.name = "Obstacle";
          randCell.obstacle = true;
        }
      }

      const items = [
        {
          name: "Umbrella",
          icon: "🌂",
          stat: {
            dommage: 6,
            move: 2
          }
        },
        {
          name: "Knife",
          icon: "🔪",
          stat: {
            dommage: 10,
            move: 0
          }
        },
        {
          name: "Star",
          icon: "💫",
          stat: {
            dommage: 10,
            move: 0
          }
        }
      ];
      for (let i = 0; i < this.numItems; i++) {
        randCell = this.map[this.randInt(0, this.height)][
          this.randInt(0, this.width)
        ];
        if (randCell.name === "Ground") {
          randCell.name = "Item";
          randCell.obstacle = false;
          randCell.obj = items[this.randInt(0, items.length)];
        }
      }
    },
    action(e) {
      const x = Number(e.target.attributes.x.value);
      const y = Number(e.target.attributes.y.value);
      console.log(
        `x: ${x} / y: ${y} - ${this.map[y][x].name}: `,
        this.map[y][x]
      );
      this.select = this.map[y][x];
      if (this.map[y][x].view_distance === "Distance") {
        this.map[this.movePlayer.y][this.movePlayer.x] = {
          name: "Ground",
          x: this.movePlayer.x,
          y: this.movePlayer.y,
          items: [],
          obstacle: false,
          view_distance: null
        };
        this.movePlayer.x = x;
        this.movePlayer.y = y;
        if (this.map[y][x].name === "Item") {
          this.movePlayer.items.push(this.map[y][x].obj);
        }
        this.map[y][x] = this.movePlayer;
      }
      if (this.map[y][x].name === "Player") {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            this.map[y][x].view_distance = null;
            this.movePlayer = null;
          }
        }
        const accessible = this.accessibleCellsAround(
          x,
          y,
          this.map[y][x].obj.stat.move
        );
        accessible.forEach(e => {
          this.map[e.y][e.x].view_distance = "Distance";
        });
        this.movePlayer = this.map[y][x];
      }
      if (this.map[y][x].name === "Ground") {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            this.map[y][x].view_distance = null;
            this.movePlayer = null;
          }
        }
      }
    },
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
    },
    cellIsWalkable(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return false;
      }
      return !this.map[y][x].obstacle;
    },
    randInt(min, max) {
      return min + Math.floor((max - min) * Math.random());
    }
  }
};
</script>
<style lang="scss">
#game,
table {
  margin: 55px auto 0 auto;
}

.option {
  position: fixed;
  padding: 5px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1b2431db;
  max-width: 840px;
  .icon {
    i {
      margin: 0 !important;
    }
  }
}

.info {
  cursor: pointer;
  position: fixed;
  margin: 20px auto;
  bottom: 8px;
  left: 0;
  right: 0;
  width: 260px;
  background: #0093ee;
  color: #fff;
  box-shadow: 0 1px 5px 0 #171e29;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 16px;
  border-radius: 6px;

  b {
    width: 100%;
    margin-bottom: 15px;
    text-align: center;
  }

  .info-obj {
    width: 100%;
    display: flex;

    .stat {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .view {
      width: 100%;
      font-size: 50px;
    }
  }
}

.cell {
  cursor: pointer;
  padding: 20px;
  border-radius: 4px;
}

.obj {
  padding: 0;
}

.Player1 {
  background: #783ddb;
}

.Player2 {
  background: #26c1c9;
}

.Player3 {
  background: #a00000;
}

.Player4 {
  background: #2644c9;
}

.Player5 {
  background: #772a16;
}

.Item {
  background: linear-gradient(-45deg, #31ca12, #8db79c, #0cb988);
  background-size: auto;
  background-size: 400% 400%;
  animation: Gradient 8s ease infinite;
}

.Ground {
  background: #96bf47;
}

.Distance {
  background: #85c5b5;
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
