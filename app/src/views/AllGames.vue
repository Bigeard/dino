<template>
  <div class="allGames">
    <div class="content">
      <gb-heading tag="h1" class="logo">Dino 🦖</gb-heading>
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
          <gb-badge>Players : {{ players.length }} / 5</gb-badge>
          <div class="player_list">
            <ul class="players">
              <li
                v-for="(player, i) in players"
                :key="i"
                :class="`Player${i + 1}`"
              >
                <img src="../../public/img/icons/zorfiL.gif" />{{ player }}
              </li>
            </ul>
          </div>
          <gb-button :disabled="game.status != 'yourTurn'" class="icon">{{ game.status }}</gb-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "AllGames",
  data() {
    return {
      games: [{
        id: 1,
        code: 12345,
        created_at: "01/01/2021",
        update_at: "08/01/2021",
        status: "winner",
        name: "Game 1"
      },
      {
        id: 2,
        code: 123,
        created_at: "02/01/2021",
        update_at: "07/01/2021",
        status: "looser",
        name: "Game 2"
      },
      {
        id: 3,
        code: 1235,
        created_at: "04/01/2021",
        update_at: "05/01/2021",
        status: "inProgress",
        name: "Game 3"
      },
      {
        id: 4,
        code: 132,
        created_at: "02/01/2021",
        update_at: "07/01/2021",
        status: "yourTurn",
        name: "Game 4"
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
