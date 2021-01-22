<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo"
      >Dino <img src="../assets/game/zorfiL.gif" alt="Dino"
      /></gb-heading>
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
          @click="$router.push('/room')"
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
    } else {
      await axios.get("http://localhost:8000/api/user/readByPassId/" + user.pass_id)
        .then(function(response) {
          user.username = response.data.username;
        })
        .catch(function(error) {
          console.log(error);
        });
      await this.$db.user.update(0, user);
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
        this.$router.push("/room/" + v);
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
        if (!user.pass_id) {
          await axios.post("http://localhost:8000/api/user/create", {
            "username": this.username
          }).then(function(response) {
            user.username = response.data.username;
            user.pass_id = response.data.passId;
          }).catch(function(error) {
            console.log(error);
          });
        } else {
          user.username = this.username;
          await axios.patch("http://localhost:8000/api/user/update", {
            "username": this.username,
            "passId": user.pass_id
          }).catch(function(error) {
            console.log(error);
          });
        }
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
}
</style>
