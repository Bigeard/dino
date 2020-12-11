<template>
  <div class="home">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
      <!-- Navigation -->
      <div class="nav">
        <gb-input
          label="Search Game !"
          placeholder="Enter the code..."
          disabled
        />
        <!-- v-model="synchronizedValue" -->
        <gb-button disabled right-icon="add">New Game</gb-button>
        <gb-button disabled right-icon="search">
          My Games
        </gb-button>
        <gb-button @click="$router.push('/about')" right-icon="info">
          About
        </gb-button>

        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
      </div>
      <gb-divider />
      <!-- User Info -->
      <div class="user">
        <div class="username">
          <gb-input
            label="Username"
            placeholder="Username is required"
            info="Please add a username to start playing"
          />
          <gb-button>✔️</gb-button>
        </div>
        <!-- error="A minimum of 3 characters is required" -->
        <p>Pass ID: XGFi3SHgXGFi3SHgXGFi3SHg</p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home"
  // ,components: {
  //   // HelloWorld
  // }
};
</script>

<style lang="scss">
.home {
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin-top: 30px;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 40px !important;
  }

  .username {
    display: flex;
    align-items: center;
    .gb-field-input {
      width: 100%;
      margin-right: 10px;
    }
    .gb-base-button {
      height: 42px;
    }
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
