<template>
  <div class="room">
    <div class="content">
      <div class="content-game">
        <p class="game_code" v-if="game.code">
          Game Code :
          <input class="pass_code" id="code" :value="game.code" />
        </p>
        <gb-button
          class="copy-game-code"
          @click="copyGameCode()"
          right-icon="save"
        >
          Copy
        </gb-button>
      </div>
      <gb-divider class="divider-custom" />
      <!-- Navigation -->
      <div class="nav">
        <div class="game">
          <gb-input
            class="game_name"
            v-model="gamename"
            label="Name of this game"
            placeholder="name is required"
            :info="info"
            :error="error"
            :status="status"
          />
          <gb-button @click="checkGamename" :class="status + '_valid'">
            ✔️
          </gb-button>
        </div>
        <gb-badge>Players : {{ players.length }} / 5</gb-badge>
        <div class="player_list">
          <ul class="players">
            <li
              v-for="(player, i) in players"
              :key="i"
              :class="`Player${i + 1}`"
            >
              <img src="../../public/img/icons/zorfiL.gif" />{{ player }}
            </li>
          </ul>
        </div>
        <gb-divider class="divider-custom2" />
        <gb-button
          class="generate-new-map"
          @click="generateNewMap()"
          right-icon="refresh"
        >
          Generate New Map
        </gb-button>
        <div class="mini-map">
          <table>
            <tr v-for="(row, y) in game.map" :key="y">
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
              ></td>
            </tr>
          </table>
        </div>
        <div class="choice_button">
          <gb-button @click="$router.push('/')" right-icon="home">
            Home
          </gb-button>
          <gb-button
            :disabled="status !== 'normal' || game.name === ''"
            @click="$router.push('/game')"
            right-icon="arrow_forward"
          >
            Strart Game
          </gb-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateMap } from "../game/lib/index";
import { items } from "../game/data/items";

export default {
  name: "Room",
  data() {
    return {
      game: { name: "", code: "666" },
      gamename: "",
      width: 20,
      height: 20,
      players: ["toto_1", "toto_2", "toto_3", "toto_4"],
      numObstacle: 40,
      numItems: 6,
      info: null,
      status: "normal",
      error: null
    };
  },
  beforeMount() {
    const { new_map, gen_player } = generateMap(
      this.width,
      this.width,
      this.players,
      this.numObstacle,
      this.numItems,
      items
    );
    this.game.map = new_map;
    this.game.players = gen_player;
    this.onChangeGamename(this.gamename);
  },
  watch: {
    gamename(v) {
      this.onChangeGamename(v);
    }
  },
  methods: {
    onChangeGamename(v) {
      if (v.length === 0) {
        this.info = "Please add a username to start playing";
        this.status = "warning";
        this.error = null;
      } else if (v.length < 3) {
        this.error = "A minimum of 3 characters is required";
        this.status = "error";
        this.info = null;
      } else if (v.length > 13) {
        this.error = "A maximum of 12 characters is required";
        this.status = "error";
        this.info = null;
      } else if (!/^[\w.]*$/.test(v)) {
        this.error =
          'you can only use the following characters: "A-z" "0-9" "_"';
        this.status = "error";
        this.info = null;
      } else {
        this.info = null;
        this.error = null;
        this.status = "normal";
      }
    },
    async checkGamename() {
      if (this.status === "normal") {
        this.game.name = this.gamename;
      }
    },
    copyGameCode() {
      const copyText = document.getElementById("code");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }
  }
};
</script>

<style lang="scss">
.room {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow-y: scroll;

  .error_valid,
  .warning_valid {
    display: none;
  }

  .content {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin-top: 30px;
    margin: 6px 6px 30px 6px;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 40px !important;
  }

  .content-game {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .player_list {
    width: 100%;
    display: flex;
    align-items: flex-start;
    .players {
      max-width: 321px;
      height: 110px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      list-style: none;
      text-align: left;
      padding: 0 20px;
      li {
        display: flex;
        height: 48px;
        flex-direction: row;
        align-items: center;
        border-radius: 25px;
        padding-right: 10px;
      }
    }
  }

  .game {
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
    width: 100%;
    .game_name {
      width: 80% !important;
      margin-right: 10px;
    }
    .gb-base-button {
      width: 20% !important;
      height: 42px;
    }
  }

  .choice_button {
    display: flex;
    width: 100%;
    justify-content: space-between;
    button {
      width: 45% !important;
      height: 45px;
    }
  }

  .mini-map {
    table {
      margin: 0 auto;
    }
    .cell {
      cursor: default;
      padding: 7px;
    }
  }

  .pass_code {
    margin-left: 10px;
    background-color: #222c3c;
    box-shadow: 0 1px 5px 0 #18191a;
    padding: 10px;
    border-radius: 4px;
  }

  .nav {
    .gb-base-button,
    .gb-field-input {
      width: 100%;
      margin-top: 20px;
    }
  }

  .divider-custom {
    margin: 25px auto 0 auto;
  }

  .divider-custom2 {
    margin: 10px auto 25px auto;
  }

  .generate-new-map {
    width: 322px !important;
    margin: 0 auto 20px auto !important;
  }

  .code {
    display: flex;
    flex-direction: column;
    height: 65px;
    justify-content: space-between;
  }
}
</style>
