<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref='bgImage'>
            <div class="filter" ref="filter"></div>
            <div class="play-wrapper" v-show="songs.length>0" ref="playWrapper">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text" @click="random">随机播放全部</span>
                </div>
            </div>
        </div>
        <div class="bg-layer" ref='layer'></div>
        <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref='list'>
            <div class="song-list-wrapper">
                <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading :title="loadingInfo"></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list.vue'
import { prefixStyle } from 'common/js/dom.js'
import Loading from 'base/loading/loading.vue'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin.js'
const transform = prefixStyle('transform')
const backdropFilter = prefixStyle('backdrop-filter')
const RESERVE_HEIGHT = 150


export default {
    mixins: [playlistMixin],
    data() {
        return {
            scrollY: 0,
            loadingInfo: '正在载入中……'
        }
    },
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    },
    mounted() {
        this.bgImageHeight = this.$refs.bgImage.clientWidth
        this.translateY = -this.bgImageHeight+RESERVE_HEIGHT
        this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    methods: {
        scroll(pos) {
            this.scrollY = pos.y
        },
        // 点击back按钮，回退到上一个页面
        back() {
            this.$router.back()
        },
        selectItem(item, index) {
            this.selectPlay({
                list: this.songs,
                index
            })
        },
        // 点击随机播放按钮，进行随机播放歌曲
        random() {
            this.randomPlay({
                list: this.songs
            })
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ]),
        handlePlaylist(playlist) {
            const bottom = playlist.length>0?'60px': ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.refresh()

        }
    },
    watch: {
        scrollY(newY) {
            let translateY = Math.max(newY, this.translateY)
            let zIndex = 0
            let scale = 1
            let blur = 0
            const percent = Math.abs(newY / this.bgImageHeight)
            this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
            // this.$refs.layer.style.webkitTransform = `translate3d(0, ${translateY}px, 0)`
            if(newY<this.translateY) {
                zIndex = 10
                this.$refs.bgImage.style.paddingTop = 0
                this.$refs.bgImage.style.height = `40px`
                this.$refs.playWrapper.style.display = 'none'
            } else {
                zIndex = 0
                this.$refs.bgImage.style.paddingTop = `70%`
                this.$refs.bgImage.style.height = 0
                this.$refs.playWrapper.style.display = 'block'
            }
            
            if(newY>0) {
                scale = 1+percent 
                zIndex = 10 
            } else {
                blur = Math.min(20*percent, 20)
            }
            this.$refs.bgImage.style.zIndex = zIndex
            this.$refs.bgImage.style[transform] = `scale(${scale})`
            // this.$refs.bgImage.style.webkitTransform = `scale(${scale})`

            this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
            this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        }
    },
    computed: {
        bgStyle() {
            return `background-image:url(${this.bgImage})`
        }
    },
    components: {
        Scroll,
        SongList,
        Loading
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
