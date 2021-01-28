<template>
  <div class="page404">
    <div class="content">
      <img src="../assets/game/zorfiL_dead.png" alt="Dino Dead" />
      <gb-heading tag="h1" class="logo">Not Found !</gb-heading>
      <!-- Navigation -->
      <div class="nav">
        <gb-button @click="$router.push('/')" right-icon="home">
          Back to the home page
        </gb-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404"
};
</script>

<style lang="scss">
.page404 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  img {
    width: 200px;
  }

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
