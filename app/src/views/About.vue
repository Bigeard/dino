<template>
  <div class="about">
    <h1>This is an about page</h1>
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
