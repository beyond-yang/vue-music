<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive标签可以把router-view中渲染出的dom元素缓存到内存中 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header.vue'
import Tab from 'components/tab/tab.vue'
import Player from 'components/player/player.vue'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
