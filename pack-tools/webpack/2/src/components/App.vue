<style lang="stylus" scoped>
#myapp
  width: 100%
  background-color: #d6d6d6
  .content
    width: 100%
    height: 100%
    h1
      font-size: 22px
      color: red
    span
      font-size: 18px
      color: blue
</style>
<template>
    
    <div id="myapp">
        <div class="content">
            <h1>{{ title }}</h1>
            <span>{{content}}</span>
        </div>
    </div>
</template>
<script>
 export default {
     data() {
         return {
             title: '我是App.vue的标题',
             content: '我是App.vue的内容',
             lzcEmail: 'ccc_simon@163.com'
         };
     },

     mounted() {
         console.log('App.vue mounted');
     }
 }
</script>
