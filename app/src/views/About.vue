<template>
  <div class="about">
    <gb-heading tag="h1" class="logo"
      >Dino <img src="../assets/game/zorfiL.gif" alt="Dino"
    /></gb-heading>

    <div class="author">
      <gb-heading tag="h1">Axel Ollivier</gb-heading>
      <gb-heading tag="h1">Clement Pageaux</gb-heading>
      <gb-heading tag="h1">Corentin Guiard</gb-heading>
      <gb-heading tag="h1">Bigeard</gb-heading>
    </div>

    <div class="goal">
      <gb-heading tag="h2">Goal of the game : </gb-heading>
      <gb-heading tag="p"
        >This game is a turn-based battleRoyal. The object of the games is to
        succeed in being the last survivor.
      </gb-heading>
    </div>

    <div class="rules">
      <gb-heading tag="h2">Rule of the game : </gb-heading>
      <gb-heading tag="p"
        >Each player starts with the same amount of health, attack and movement
        points.<br />
        To be able to play your turn, you will have to wait for the other
        players to finish their turn.<br />
        Each turn, you can either move to a green square, move to a square with
        an item, or attack a player.<br />
        At the end of your turn, it must pass to the next player's turn.<br />
        By collecting items, you will be able to increase your stats and have a
        better chance of surviving.
      </gb-heading>
    </div>

    <div class="info">
      <ul>
        <li>
          Template:
          <a href="https://www.growthbunker.dev/vuedarkmode">Vue Dark Mode</a>
        </li>
        <li>
          Sprite: <a href="https://arks.itch.io/dino-characters">Dino GIF</a>
        </li>
        <li>
          Repo: <a href="https://github.com/Bigeard/dino">Dino Project</a>
        </li>
      </ul>
    </div>

    <gb-button @click="$router.push('/')" right-icon="home">
      Return
    </gb-button>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style lang="scss">
.about {
  padding: 10px;
  margin-bottom: 180px;

  .logo {
    margin-top: 15px;
    font-size: 65px !important;
    line-height: normal !important;
    margin-bottom: 15px !important;

    img {
      width: 74px;
      margin-bottom: -12px;
    }
  }

  .author {
    margin-bottom: 30px;
  }

  .info {
    display: flex;
    justify-content: center;

    ul {
      margin: auto;
      width: 100%;
      text-align: left;
      list-style-type: none;
    }
  }
}
</style>
