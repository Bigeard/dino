<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
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
        <gb-badge>Players : 5/5</gb-badge>
        <div class="player_list">
          <ul class="players">
            <li><img src="../../public/img/icons/zorfiL.gif" />Bigeard</li>
            <li><img src="../../public/img/icons/zorfiL.gif" />Coco</li>
            <li><img src="../../public/img/icons/zorfiL.gif" />Clément</li>
            <li><img src="../../public/img/icons/zorfiL.gif" />Axel</li>
            <li><img src="../../public/img/icons/zorfiL.gif" />Corentin</li>
          </ul>
        </div>
        <div class="choice_button">
          <gb-button @click="$router.push('/')" right-icon="home">
            Home
          </gb-button>
          <gb-button
            :disabled="!game.game_id"
            @click="$router.push('/game')"
            right-icon="gps_fixed"
          >
            Strart Game
          </gb-button>
        </div>
      </div>
      <gb-divider />
      <!-- User Info -->
      <div class="user">
        <p class="game_id" v-if="game.game_id">
          Game ID :
          <span class="pass_id">{{ game.game_id }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Room",
  async beforeMount() {
    let game = await this.$db.game.get({ id: 0 });
    if (game === undefined) {
      game = {
        id: 0,
        gamename: "",
        game_id: null,
        updated_at: new Date()
      };
      await this.$db.game.add(game);
    }
    this.onChangeGame(game.game);
    if (this.status === "normal") {
      this.gamename = game.gamename;
      this.game = game;
    }
  },
  data() {
    return {
      code_game: null,
      gamename: null,
      info: null,
      error: null,
      status: "normal",
      game: {
        gamename: null,
        game_id: null
      }
    };
  },
  watch: {
    code_game(v) {
      if (v.length > 8) {
        this.$router.push("/game");
      }
    },
    game(v) {
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
        const game = {
          id: 0,
          gamename: this.gamename,
          game_id: "EUYahAs3u77YP9Bb"
        };
        await this.$db.game.update(0, game);
        this.game = game;
      }
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
    width: 20%;
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin-top: 30px;
    margin: 6px 6px 30px 6px;
    @media screen and (max-width: 1300px) {
      width: 30%;
    }
    @media screen and (max-width: 992px) {
      width: 50%;
    }
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 40px !important;
  }

  .player_list {
    width: 100%;
    display: flex;
    align-items: flex-start;
    text-align: none;
    .players {
      list-style: none;
      text-align: left;
      padding-left: 20px;
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
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

  .game_id {
    display: flex;
    flex-direction: column;
    height: 65px;
    justify-content: space-between;
  }
}
</style>
