<template>
    <transition name="slide">
        <div v-show="showFlag" class="add-song" @click.stop>
            <div class="header">
                <h1 class="tilte">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
              <search-box ref="searchBox" @query="getQuery" :placeholder="'搜索歌曲'"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
              <switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></switches>
              <div class="list-wrapper">
                <scroll ref="songList" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
                  <div class="list-inner">
                    <song-list @select="selectSong" :songs="playHistory"></song-list>
                  </div>
                </scroll>
                <scroll :refreshDelay="refreshDelay" ref="searchList" class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
                  <div class="list-inner">
                    <search-list @deleteOne="deleteHistoryOne" @select="addQuery" :searches="searchHistory"></search-list>
                  </div>
                </scroll>
              </div>
            </div>
            <div class="search-result" v-show="query">
              <suggest @inputBlur="inputBlur" @searchItem="selectSuggest" :query="query" :showSinger="showSinger"></suggest>
            </div>
            <top-tip ref="toptip">
              <div class="tip-title">
                <i class="icon-ok"></i>
                <span class="text">一首歌曲已经添加至播放列表</span>
              </div>
            </top-tip>
        </div>
    </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box.vue'
import Suggest from 'components/suggest/suggest.vue'
import {searchMixin} from 'common/js/mixin.js'
import Switches from 'base/switches/switches.vue'
import Scroll from 'base/scroll/scroll.vue'
import {mapGetters, mapActions} from 'vuex'
import SongList from 'base/song-list/song-list.vue'
import Song from 'common/js/song.js'
import SearchList from 'base/search-list/search-list.vue'
import TopTip from 'base/top-tip/top-tip.vue'
export default {
    mixins: [searchMixin],
    data() {
        return {
            showFlag: false,
            showSinger: false,
            currentIndex: 0,
            switches:[
              {
                name: '最近播放'
              },
              {
                name: '搜索历史'
              }
            ]
        }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    methods: {
        show() {
            this.showFlag = true
            setTimeout(()=>{
              if(this.currentIndex === 0) {
                this.$refs.songList.refresh()
              } else {
                this.$refs.searchList.refresh()
              }
            }, 20)
        },
        hide() {
            this.showFlag = false
        },
        selectSuggest(songname) {
          this.saveSearch(songname)
          this.showTopTip()
        },
        switchItem(index) {
          this.currentIndex = index
        },
        selectSong(song, index) {
          if(index!==0) {
            this.insertSong(new Song(song))
            this.showTopTip()
          }
        },
        showTopTip() {
          this.$refs.toptip.show()
        },
        ...mapActions([
          'insertSong'
        ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>