<template>
  <div class="allGames">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
      <gb-button class="icon" @click="$router.push('/')" right-icon="home"
        >Home </gb-button
      ><br />
      <div>
        <h2>My Games :</h2>
        <filter id="inProgress"> </filter>
        <filter id="end"> </filter>
        <div
          :class="'card ' + game.status"
          v-for="game in games"
          :key="game.id"
        >
          <!-- <p>Round : {{ round }}</p> -->
          <p>Name : {{ game.name }}</p>
          <p>Code : {{ game.code }}</p>
          <p>Created by : {{ game.created_at }}</p>
          <p>Update at : {{ game.update_at }}</p>
          <button v-if="game.status" class="joinGame" click="#">Go !</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Games from "../allGames/index.js";
export default {
  name: "AllGames",
  data() {
    return {
    games: [{
      id: 1,
      code: 12345,
      created_at: "01/01/2021",
      update_at: "08/01/2021",
      status: true,
      name: "Game 1"
    },
    {
      id: 2,
      code: 123,
      created_at: "02/01/2021",
      update_at: "07/01/2021",
      status: false,
      name: "Game 2"
    },
    {
      id: 3,
      code: 1235,
      created_at: "04/01/2021",
      update_at: "05/01/2021",
      status: false,
      name: "Game 3"
    }],
    players: ["toto_1", "toto_2", "toto_3", "toto_4"],
    }
  }
};
</script>
<style lang="scss">
.allGames {
  align-items: center;
  justify-content: center;
  height: 100vh;
  display: flex;

  .content {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #171e29;
    padding: 30px;
    margin-top: 30px;
    margin: 6px 6px 30px 6px;
    width: 20%;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
  }

  .card {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #ac3333;
    margin: 6px 6px 30px 6px;
    padding: 3%;
    color: #171e29;
    text-align: center;
  }

  .true {
    background-color: rgb(24, 133, 24);
  }

  .joinGame {
    margin: 5px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border-color: #3f536e;
    cursor: pointer;
  }

  h2 {
    text-align: left;
  }

  .icon {
    margin: 6px 6px 6px;
    width: 80%;
  }

  .btnGo {
  }
}
</style>
