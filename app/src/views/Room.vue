<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
      <!-- Navigation -->
      <div class="nav">
        <div class="game">
          <gb-input
            class="game_name"
            v-model="username"
            label="Name of this game"
            placeholder="name is required"
            :info="info"
            :error="error"
            :status="status"
          />
          <gb-button @click="checkUsername" :class="status + '_valid'">
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
          <gb-button
            :disabled="!user.pass_id"
            @click="$router.push('/')"
            right-icon="home"
          >
            Home
          </gb-button>
          <gb-button
            :disabled="!user.pass_id"
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
        <p class="game_id" v-if="user.pass_id">
          Pass ID :
          <span class="pass_id">{{ user.pass_id }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Room",
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
      }
    };
  },
  watch: {
    code_game(v) {
      if (v.length > 8) {
        this.$router.push("/game");
      }
    },
    username(v) {
      this.onChangeUsername(v);
    }
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
    async checkUsername() {
      if (this.status === "normal") {
        const user = {
          id: 0,
          username: this.username,
          pass_id: "EUYahAs3u77YP9Bb"
        };
        await this.$db.user.update(0, user);
        this.user = user;
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
