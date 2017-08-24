<style lang="stylus">
 #app
   h1
     font-size: 32px
     color: red
</style>
<template>
    <div id="app">
        <h1>{{ words }}</h1>
    </div>
</template>
<script>
 export default {
     data() {
         return {
             words: 'Welcome to webpack-vue demo !'
         };
     }
 }
</script>
