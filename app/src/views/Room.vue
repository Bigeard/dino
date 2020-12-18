<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
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
          @click="$router.push('/game')"
          right-icon="add"
        >
          New Game
        </gb-button>
        <gb-button
          :disabled="!user.pass_id"
          @click="$router.push('/game')"
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
          <gb-button @click="checkUsername" :class="status + '_valid'"
            >✔️</gb-button
          >
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
    margin-top: 30px;
    margin: 6px 6px 30px 6px;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 40px !important;
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
