<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>hola mundo</h1>
    <button @click="goToDayBook" class="btn btn-primary">Primary</button>
    <button @click="goToDayBook" class="btn btn-secondary">Secondary</button>
    <button @click="goToDayBook" class="btn btn-success">Success</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToDayBook(){
      this.$router.push({name:'daybook'}) // al darle click en button @click="goToDayBook" 
    } // me lleva a la ruta /daybook
  },
}
</script>
