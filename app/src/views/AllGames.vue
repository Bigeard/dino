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
                    <p>Date : {{ game.update_at }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const games = [
   { id: 1, code: 12345, created_at: '01/01/2021', updated_at: '08/01/2021', status: true },
   { id: 2, code: 123, created_at: '02/01/2021', updated_at: '07/01/2021', status: false },
   { id: 3, code: 1235, created_at: '04/01/2021', updated_at: '05/01/2021', status: false }
]

export default {
  name: "AllGames"
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
}
</style>