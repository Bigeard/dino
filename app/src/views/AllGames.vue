<template>
  <div class="allGames">
    <div class="content">
      <gb-heading tag="h1" class="logo"
        >Dino <img src="../assets/game/zorfiL.gif" alt="Dino"
      /></gb-heading>
      <gb-button class="icon" @click="$router.push('/')" right-icon="home"
        >Home </gb-button
      ><br />
      <div>
        <h2>My Games :</h2>
        <div
          :class="'card ' + game.status"
          v-for="game in games"
          :key="game.id"
        >
          <p>Name : {{ game.name }}</p>
          <p>Code : {{ game.code }}</p>
          <p>Created by : {{ game.created_at }}</p>
          <p>Update at : {{ game.update_at }}</p>
          <gb-badge>Players : {{ game.players.length }} / 5</gb-badge>
          <div class="player_list">
            <ul class="players">
              <li
                v-for="(player, i) in game.players"
                :key="i"
                :class="`Player${i + 1}`"
              >
                <img src="../../public/img/icons/zorfiL.gif" />{{ player.name }}
              </li>
            </ul>
          </div>
          <gb-button :disabled="game.status != 'yourTurn'" class="icon">{{ game.status }}</gb-button>
          <gb-button @click="$router.push('/game/' + game.code)" class="icon">See game</gb-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "AllGames",
  async beforeMount() {
    this.games = await this.$db.game.toArray();
  },
  data() {
    return {
      games: []
    }
  },
  methods: {
    async findGames() {
      const games = await this.$db.game.toArray();
      return games;
    }
  },
};
</script>
<style lang="scss">
.allGames {
  align-items: center;
  justify-content: center;
  display: flex;

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
  }

  .card {
    border: 1px solid #3f536e;
    border-radius: 8px;
    background-color: #616060;
    margin: 6px 6px 30px 6px;
    padding: 3%;
    text-align: center;
  }

  .winner {
    background-color: rgb(24, 133, 24);
  }

  .looser {
    background-color: #ac3333;
  }

  .inProgress {
    background-color: #3f536e;
  }

  h2 {
    text-align: left;
  }

  .icon {
    margin: 6px 6px 6px;
    width: 80%;
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
}
</style>
