<template>
  <div class="room">
    <div class="content">
      <div class="content-game">
        <p class="game_code" v-if="game.code">
          Game Code :
          <input class="pass_code" id="code" :value="game.code" disabled />
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
        <div class="nav-game">
          <gb-input
            class="game_name"
            v-model="gamename"
            label="Name of this game"
            placeholder="name is required"
            :info="info"
            :error="error"
            :status="status"
            :disabled="user.pass_id === game.owner"
          />
          <gb-button
            @click="checkGamename"
            :class="status + '_valid'"
            right-icon="done"
            :disabled="user.pass_id === game.owner"
          >
            Validate
          </gb-button>
        </div>
        <gb-badge>Players : {{ game.players.length }} / 5</gb-badge>
        <div class="player_list">
          <ul class="players">
            <li
              v-for="(player, i) in playersShow"
              :key="i"
              :class="`Player${i + 1}`"
            >
              <img src="../../public/img/icons/zorfiL.gif" />{{ player.name }}
            </li>
          </ul>
        </div>
        <gb-divider class="divider-custom2" />
        <gb-button
          class="generate-new-map"
          @click="generateNewMap()"
          right-icon="refresh"
          v-model="generateNewMapCount"
          :disabled="user.pass_id === game.owner"
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
            :disabled="
              status !== 'normal' ||
                game.name === '' ||
                user.pass_id === game.owner ||
                game.players.length > 1 ||
                game.players.length < 6
            "
            @click="startGame()"
            right-icon="arrow_forward"
          >
            Strart Game
          </gb-button>
        </div>
      </div>
    </div>
    <gb-toast
      v-if="infoClipboard !== ''"
      id="info-clipboard"
      color="purple"
      :closable="false"
      >{{ infoClipboard }}</gb-toast
    >
  </div>
</template>

<script>
import { generateMap } from "../game/lib/index";
import { items } from "../game/data/items";
import axios from "axios";

export default {
  name: "Room",
  beforeMount() {
    this.getGame();
    this.generateNewMap();
    this.onChangeGamename(this.gamename);
  },
  data() {
    return {
      user: {
        username: null,
        pass_id: null
      },
      game: {
        name: "",
        code: "666",
        map: [],
        actions: [],
        players: [],
        owner: null,
        status: "inProgress"
      },
      gamename: "",
      width: 20,
      height: 20,
      numObstacle: 40,
      numItems: 6,
      playersShow: [],
      info: null,
      status: "inProgress",
      error: null,
      infoClipboard: "",
      generateNewMapCount: 0
    };
  },
  /*
  async created() {
    setInterval(() => {
      axios
        .get(`http://localhost:8000/game`)
        .then(response => {
          // JSON responses are automatically parsed.
          console.log(response);
          //this.players = response.data.players;
        })
        .catch(e => {
          console.error(e);
        });
    }, 3000);
  },
  */
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
      navigator.clipboard.writeText(this.game.code).then(
        () => {
          this.infoClipboard = "Copying to clipboard was successful!";
        },
        err => {
          this.infoClipboard = "Could not copy text... " + err;
          console.error("Async: Could not copy text: ", err);
        }
      );
      setTimeout(() => {
        this.infoClipboard = "";
      }, 3000);
    },
    async getGame() {
      axios
        .get(
          "http://localhost:8000/api/game/readByCode/" + this.$route.params.code
        )
        .then(response => {
          // JSON responses are automatically parsed.
          this.game.code = response.data.code;
          this.game.players = response.data.players;
          this.game.owner = response.data.owner;
          this.playersShow = response.data.players;
        })
        .catch(e => {
          console.error("There was an error !", e);
        });
    },
    async generateNewMap() {
      const user = await this.$db.user.get({ id: 0 });
      // @TODO Temporary
      if (this.game.players.length === 3) {
        this.game.players.unshift(user.username);
      }
      const { new_map, gen_player } = generateMap(
        this.width,
        this.width,
        this.game.players,
        this.numObstacle,
        this.numItems,
        items
      );
      this.game.map = new_map;
      this.game.players = gen_player;
      this.generateNewMapCount++;
      //console.log(1, this.game.map);
      console.log(2, gen_player);
      //console.log(3, this.game.players);
    },
    async startGame() {
      /*
      await this.$db.game.add({
        _id: this.game._id,
        name: this.game.name,
        code: this.game.code,
        map: this.game.map,
        players: this.game.players,
        width: this.width,
        height: this.height,
        status: "inProgress"
      });
      */

      const game = {
        name: this.game.name,
        code: this.game.code,
        map: this.game.map,
        actions: this.game.actions,
        players: this.game.players,
        owner: this.game.owner,
        status: this.game.status
      };
      axios
        .patch("http://localhost:8000/api/game/update", game)
        .then(response => {
          // JSON responses are automatically parsed.
          console.log("The game was update !");
          console.log(response);
          this.$router.push("/game/" + this.game.code);
        })
        .catch(e => {
          console.error("There was an error !", e);
        });
    }
  }
};
</script>

<style lang="scss">
.room {
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin-top: 30px;
    margin: 6px 6px 30px 6px;
  }

  .content-game {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .game_code {
    margin: 0;
  }

  .pass_code {
    width: 200px;
    background-color: #222c3c;
    color: #fff;
    box-shadow: 0 1px 5px 0 #18191a;
    padding: 10px;
    margin-left: 10px;
    border-radius: 4px;
    border: none;
    margin-right: 10px;
    font-size: 20px;
  }

  .code {
    display: flex;
    flex-direction: column;
    height: 65px;
    justify-content: space-between;
  }

  .error_valid,
  .warning_valid {
    display: none;
  }

  .divider-custom {
    margin: 25px auto 0 auto;
  }

  .nav {
    .gb-base-button,
    .gb-field-input {
      width: 100%;
      margin-top: 20px;
    }

    .nav-game {
      margin-bottom: 20px;
    }
  }

  .game {
    width: 100%;
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
    .game_name {
      width: 80% !important;
      margin-right: 10px;
    }
    .gb-base-button {
      width: 20% !important;
      height: 42px;
    }
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
      margin: 10px auto;
      li {
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 25px;
        padding-right: 10px;
      }
    }
  }

  .divider-custom2 {
    margin: 10px auto 25px auto;
  }

  .generate-new-map {
    margin: 0 auto 20px auto !important;
  }

  .mini-map {
    table {
      margin: 0 auto;
    }
    .cell {
      cursor: default;
      padding: 10px;
    }

    @media (max-width: 520px) {
      .cell {
        padding: calc(4px + (100vw * 0.005)) !important;
      }
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

  #info-clipboard {
    position: absolute;
    bottom: 160px;
    left: auto;
    right: auto;
    text-align: center;
  }
}
</style>
