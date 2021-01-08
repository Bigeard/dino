<template>
    <div class="allGames">
        <div class="option">
            <gb-button class="icon" @click="$router.push('/')" right-icon="home" />
            <gb-button class="icon" @click="$router.push('/about')" right-icon="info" />
        </div>
        <div class="content">
            <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
            <div>
                <h2>Mes parties :</h2>
                <div class="card" v-for="game in games" :key="game.id">
                    <!-- <p>Round : {{ round }}</p> -->
                    <p>Code : {{ game.code }}</p>
                    <p>Created by : {{ game.created_at }}</p>
                    <p>Update at : {{ game.update_at }}</p>
                    <gb-button v-if="game.status" class="joinGame" click="#">Jouer mon tours</gb-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Games from "../allGames/index.js";
export default {
  name: "AllGames",
  data() {
    return new Games();
  },
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
    width: 40%;
  }

  .logo {
    font-size: 65px !important;
    line-height: normal !important;
  }

  .card {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #d4d4d4;
    margin: 6px 6px 30px 6px;
    padding-left: 3%;
    color: #171e29;
    text-align: left;
  }

  .joinGame {
    margin: 5px;
  }
}
</style>