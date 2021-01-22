<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo"
      >Dino <img src="../assets/game/zorfiL.gif" alt="Dino"
      /></gb-heading>
      <!-- Download button -->
      <div v-if="deferredPrompt">
        <gb-heading tag="h5">Install app :</gb-heading>
        <div @click="install"  v-if="deferredPrompt" class="btn-circle-download" id="btn-download">
          <svg id="arrow" width="14px" height="20px" viewBox="17 14 14 20">
            <path d="M24,15 L24,32"></path>
            <polyline points="30 27 24 33 18 27"></polyline>
          </svg>
          <svg id="check" width="21px" height="15px" viewBox="13 17 21 15">
            <polyline points="32.5 18.5 20 31 14.5 25.5"></polyline>
          </svg>
          <svg  id="border" width="48px" height="48px" viewBox="0 0 48 48">
            <path d="M24,1 L24,1 L24,1 C36.7025492,1 47,11.2974508 47,24 L47,24 L47,24 C47,36.7025492 36.7025492,47 24,47 L24,47 L24,47 C11.2974508,47 1,36.7025492 1,24 L1,24 L1,24 C1,11.2974508 11.2974508,1 24,1 L24,1 Z"></path>
          </svg>
        </div>
      </div>
      <!-- Navigation -->
      <div class="nav">
        <gb-input
          label="Search Game !"
          placeholder="Enter the code..."
          v-model="code_game"
          :disabled="!user.pass_id"
        />
        <gb-button
          :disabled="!user.pass_id"
          @click="creatNewGame()"
          right-icon="add"
        >
          New Game
        </gb-button>
        <gb-button
          :disabled="!user.pass_id"
          @click="$router.push('/allgames')"
          right-icon="search"
        >
          My Games
        </gb-button>
        <gb-button @click="$router.push('/about')" right-icon="info">
          About
        </gb-button>
      </div>
      <gb-divider />
      <!-- User Info -->
      <div class="user">
        <div class="username">
          <gb-input
            v-model="username"
            label="Username"
            placeholder="Username is required"
            :info="info"
            :error="error"
            :status="status"
          />
          <gb-button @click="checkUsername" :class="status + '_valid'">
            Validate
          </gb-button>
        </div>
        <p v-if="user.pass_id">
          Pass ID :
          <span class="pass_id">{{ user.pass_id }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { generateMap } from "../game/lib/index";
import { items } from "../game/data/items";
import axios from "axios";

export default {
  name: "Home",
  async beforeMount() {
    let user = await this.$db.user.get({ id: 0 });
    if (user === undefined) {
      user = {
        id: 0,
        username: "",
        pass_id: null,
        updated_at: new Date()
      };
      await this.$db.user.add(user);
      // eslint-disable-next-line no-empty
    }
    this.onChangeUsername(user.username);
    if (this.status === "normal") {
      this.username = user.username;
      this.user = user;
    }
  },
  data() {
    return {
      code_game: null,
      username: null,
      info: null,
      error: null,
      status: "normal",
      user: {
        username: null,
        pass_id: null
      },
      deferredPrompt: null,
      game: {
        name: "666",
        code: "666",
        width: 20,
        height: 20,
        actions: [],
        players: ["toto_1", "toto_2", "toto_3"],
        owner: "",
        numObstacle: 40,
        numItems: 6,
        status: "normal",
        generateNewMapCount: 0
      }
    };
  },
  watch: {
    code_game(v) {
      if (v.length > 8) {
        this.$router.push("/room/" + v);
      }
    },
    username(v) {
      this.onChangeUsername(v);
    }
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    onChangeUsername(v) {
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
          "you can only use the following characters: \"A-z\" \"0-9\" \"_\"";
        this.status = "error";
        this.info = null;
      } else {
        this.info = null;
        this.error = null;
        this.status = "normal";
      }
    },
    async checkUsername() {
      if (this.status === "normal") {
        let user = await this.$db.user.get({ id: 0 });
        var self = this;
        if (!user.pass_id) {
          await axios.post("http://localhost:8000/api/user/create", {
            "username": this.username
          }).then((response) => {
            user.username = response.data.username;
            user.pass_id = response.data.passId;
          }).catch(() => {
            self.status = "error";
            self.error = "Cannot connect to the server";
          });
        } else {
          user.username = this.username;
          await axios.patch("http://localhost:8000/api/user/update", {
            "username": this.username,
            "passId": user.pass_id
          }).catch(() => {
            self.status = "error";
            self.error = "Cannot connect to the server";
          });
        }
        await this.$db.user.update(0, user);
        this.user = user;
      }
    },
    async install() {
      document.getElementById("btn-download").classList.add("load");
      setTimeout(function () {
        document.getElementById("btn-download").classList.add("done");
      }, 1000);
      this.deferredPrompt.prompt();
    },
    async creatNewGame() {
      const user = await this.$db.user.get({ id: 0 });
      const { new_map, gen_player } = generateMap(
        this.game.height,
        this.game.width,
        this.game.players,
        this.game.numObstacle,
        this.game.numItems,
        items
      );
      this.game.players.unshift(user.username);
      this.game.map = new_map;
      this.game.players = gen_player;
      this.game.generateNewMapCount++;
      this.game.owner = this.user.pass_id;

      const game = {
        name: this.game.name,
        code: this.game.code,
        map: this.game.map,
        actions: [],
        players: [{ name: this.user.username, _id: this.user.pass_id }],
        owner: this.user.pass_id,
        status: this.game.status,
      };
      axios
        .post("http://localhost:8000/api/game/create", game)
        .then(response => {
          console.log("The game was create !");
          console.log(response);
          // Pour l'instant, le this.game.code est vide car je dois le récupérer grace au back.
          // Est ce que je peux faire une requet Get dans la réponse de cette requet Post ?
          // Pour pouvoir récupérer le this.game.code et ainsi changer l'url avec une bonne url.
          //this.$router.push("/room/" + this.game.code);
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }
  }
};
</script>

<style lang="scss">
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .error_valid,
  .warning_valid {
    display: none;
  }

  .content {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin: 100px 6px 30px 6px;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 40px !important;

    img {
      width: 74px;
      margin-bottom: -12px;
    }
  }

  .username {
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;

    .gb-field-input {
      width: 100%;
      margin-right: 10px;
    }

    .gb-base-button {
      height: 42px;
    }
  }

  .pass_id {
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

  //download button style
  .btn-circle-download {
    position: relative;
    height: 48px;
    width: 48px;
    margin: auto;
    border-radius: 100%;
    background: #E8EAED;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .btn-circle-download:after {
    content: "";
    position: relative;
    display: block;
    width: 200%;
    height: 100%;
    background-image: linear-gradient(100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0));
    transform: translateX(-100%);
  }
  .btn-circle-download svg {
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
  .btn-circle-download svg#border {
    position: absolute;
    top: 0;
    left: 0;
    stroke: none;
    stroke-dasharray: 144;
    stroke-dashoffset: 144;
    transition: all 0.9s linear;
  }
  .btn-circle-download svg#arrow {
    position: absolute;
    top: 14px;
    left: 17px;
    stroke: #9098A9;
    transition: all 0.2s ease;
  }
  .btn-circle-download svg#check {
    position: absolute;
    top: 17px;
    left: 13px;
    stroke: white;
    transform: scale(0);
  }
  .btn-circle-download:hover {
    background: rgba(0, 119, 255, 0.2);
  }
  .btn-circle-download:hover #arrow path,
  .btn-circle-download:hover #arrow polyline {
    stroke: #0093EE;
  }
  .btn-circle-download.load {
    background: rgba(0, 119, 255, 0.2);
  }
  .btn-circle-download.load #arrow path,
  .btn-circle-download.load #arrow polyline {
    stroke: #0093EE;
  }
  .btn-circle-download.load #border {
    stroke: #0093EE;
    stroke-dasharray: 144;
    stroke-dashoffset: 0;
  }
  .btn-circle-download.done {
    background: #0093EE;
    animation: rubberBand 0.8s;
  }
  .btn-circle-download.done:after {
    transform: translateX(50%);
    transition: transform 0.4s ease;
    transition-delay: 0.7s;
  }
  .btn-circle-download.done #border,
  .btn-circle-download.done #arrow {
    display: none;
  }
  .btn-circle-download.done #check {
    transform: scale(1);
    transition: all 0.2s ease;
    transition-delay: 0.2s;
  }

  @keyframes rubberBand {
    from {
      transform: scale(1, 1, 1);
    }
    30% {
      transform: scale3d(1.15, 0.75, 1);
    }
    40% {
      transform: scale3d(0.75, 1.15, 1);
    }
    50% {
      transform: scale3d(1.1, 0.85, 1);
    }
    65% {
      transform: scale3d(0.95, 1.05, 1);
    }
    75% {
      transform: scale3d(1.05, 0.95, 1);
    }
    to {
      transform: scale3d(1, 1, 1);
    }
  }
}
</style>
