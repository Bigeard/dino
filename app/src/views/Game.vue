<template>
  <div class="game">
    <div class="option">
      <div>
        <gb-button
          class="icon icon-home"
          @click="$router.push('/')"
          right-icon="home"
        />
        <b>{{ name }}</b>
      </div>
      <div>
        <gb-button
          class="icon icon-info"
          @click="infoGame()"
          right-icon="info"
        />
        <gb-button class="icon" @click="refreshGame()" right-icon="refresh" />
      </div>
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
              ${cell.view_distance ? ' ' + cell.view_distance : ''}
              ${cell.name === 'Player' ? 'Player' : ''}
              `
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
        <gb-heading tag="h2"
          >{{ select.name }} : {{ select.obj.name }}</gb-heading
        >

        <div class="info-obj">
          <div class="stat">
            <b>Stat</b>
            <span v-if="select.obj.stat.health"
              >- Health : {{ select.obj.stat.health }}</span
            >
            <span>- Damage : {{ _data.calcTotalDamage(select.obj) }}</span>
            <span>- Move : {{ select.obj.stat.move }}</span>
          </div>
          <div
            :class="
              `view ${select.name === 'Player' ? 'Player view-player' : ''}`
            "
          >
            <span>{{ select.obj.icon }}</span>
          </div>
        </div>
        <b v-if="select.obj.items && select.obj.items.length" class="info-items"
          >Items</b
        >
        <div class="info-obj" v-for="(item, i) in select.obj.items" :key="i">
          <div class="stat">
            <b>{{ item.name }}</b>
            <span v-if="item.stat.health"
              >- Health : {{ item.stat.health }}</span
            >
            <span v-if="item.stat.damage"
              >- Damage : {{ item.stat.damage }}</span
            >
            <span v-if="item.stat.move">- Move : {{ item.stat.move }}</span>
          </div>
          <div class="view">
            <span>{{ item.icon }}</span>
          </div>
        </div>
      </div>
      <div class="win" v-if="closeDialogWin" @click="closeWin">
        <gb-heading tag="h1">{{ players[0].name }} won the game !</gb-heading>
        <gb-heading tag="h1">🎉 🎉 🎉</gb-heading>
      </div>
    </div>
    <div class="info" v-if="closeDialogInfo" @click="infoGame">
      <gb-heading tag="h2">Game Info</gb-heading>
      <span>Players' turn :</span>
      <div
        :class="
          `info-obj info-player Player${p.numPlayer + 1} ${
            !i ? 'dot-background' : ''
          }
          ${p.dead ? 'dead-background' : ''}`
        "
        v-for="(p, i) in players"
        :key="i"
      >
        <div class="stat">
          <b>{{ p.name }}</b>
          <span>- Health : {{ p.stat.health }}</span>
          <span>- Damage : {{ _data.calcTotalDamage(p) }}</span>
          <span>- Move : {{ p.stat.move }}</span>
        </div>
        <div :class="`view Player view-player ${p.dead ? 'Dead' : ''}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Game from "../game/index.js";
export default {
  name: "Game",
  data() {
    return new Game(this);
  },
  methods: {
    infoGame() {
      this.closeDialogInfo = this.closeDialogInfo ? false : true;
    },
    refreshGame() {
      this._data.loadGame(this);
    },
    closeInfo() {
      this.select = null;
      setTimeout;
    },
    closeWin() {
      this.closeDialogWin = false;
    },
    action(e) {
      const x = Number(e.target.attributes.x.value);
      const y = Number(e.target.attributes.y.value);
      this._data.actionGame(this, x, y, e);
    }
  }
};
</script>
<style lang="scss">
.game {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#game {
  position: relative;
  top: 0;
  left: 0;
}

#game,
table {
  margin: 55px auto 80px auto;
}

.option {
  z-index: 10;
  position: fixed;
  padding: 7px 5px 5px 5px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1b2431db;
  max-width: 836px;
  .icon {
    i {
      margin: 0 !important;
    }
  }
  .icon-info {
    margin-right: 10px;
  }
  .icon-home {
    margin-right: 20px;
  }
}

.win {
  cursor: pointer;
  position: fixed;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 300px;
  height: 146px;
  background: linear-gradient(-45deg, #31ca12, #8db79c, #0cb988);
  background-size: 400% 400%;
  animation: Gradient 8s ease infinite;
  box-shadow: 0 1px 5px 0 #171e29;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 16px;
  border-radius: 6px;

  h1 {
    margin: auto;
  }
}

.info {
  cursor: pointer;
  z-index: 100;
  position: fixed;
  margin: 20px auto;
  bottom: 8px;
  left: 0;
  right: 0;
  width: 260px;
  max-height: 400px;
  background: #171e29;
  box-shadow: 0 1px 5px 0 #171e29;
  padding: 16px;
  border-radius: 6px;
  border: 2px dashed #ffffff7a;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  h2 {
    margin: 0 auto;
  }

  .info-items {
    width: 100%;
    margin-top: 13px;
  }

  .info-player {
    padding: 8px;
    border-radius: 6px;
    margin: auto -7px;
    min-height: 70px;
    display: block;
  }

  .dot-background {
    background-size: 10px 10px;
    background-image: radial-gradient(
        circle at 50% 50%,
        #000,
        #000 1px,
        transparent 1px
      ),
      radial-gradient(circle at 0 0, #000, #000 1px, transparent 1px),
      radial-gradient(circle at 0 100%, #000, #000 1px, transparent 1px),
      radial-gradient(circle at 100% 0, #000, #000 1px, transparent 1px),
      radial-gradient(circle at 100% 100%, #000, #000 1px, transparent 1px);
  }

  .dead-background {
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      #ffffff10 10px,
      #ffffff10 20px
    );
  }

  .info-obj {
    margin-top: 10px;
    width: 100%;
    display: flex;

    .stat {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-left: 6px;
    }

    .view {
      font-size: 32px;
      margin: 10px 14px;
    }

    .view-player {
      width: 90px;
      height: 70px;
      margin: 0;
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

.Player {
  background-image: url("../assets/game/zorfiL.gif");
  background-size: cover;
}

.Dead {
  background-image: url("../assets/game/zorfiL_dead.png");
}

.Player1 {
  background-color: #783ddb !important;
}

.Player2 {
  background-color: #26c1c9 !important;
}

.Player3 {
  background-color: #a00000 !important;
}

.Player4 {
  background-color: #2644c9 !important;
}

.Player5 {
  background-color: #772a16 !important;
}

.Ground {
  background: #96bf47;
}

.Distance {
  background-color: #85c5b5;
  border: 2px dashed #ffffff7a;
  padding: 0;
}

.Item {
  background: linear-gradient(-45deg, #12c2ca, #b68db7, #0c6cb9);
  background-size: 400% 400%;
  animation: Gradient 8s ease infinite;
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

@media (max-width: 875px) {
  .game {
    overflow: scroll;
  }
}
</style>
