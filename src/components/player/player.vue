<template>
    <div class="player" v-show="playlist.length>0">
        <transition name='normal'
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">    
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img :src="currentSong.image" alt="" width="100%" height="100%">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
                 @touchstart.prevent="middleTouchstart"
                 @touchmove.prevent="middleMove"
                 @touchend="touchEnd">
                <div class="middle-l">
                    <div class="cd-wrapper" ref='cdWrapper'>
                        <div class="cd">
                            <img :class="cdCls" class="image" :src="currentSong.image" alt="">
                        </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                      <div class="playing-lyric">{{playingLyric}}</div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data='currentLyric&&currentLyric.lines'>
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p ref="lyricLine" 
                         class="text" 
                         v-for="(line, index) in currentLyric.lines" 
                         :key="index"
                         :class="{'current': currentLineNum==index}">
                        {{line.txt}}
                      </p>
                    </div>
                  </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                  <span class="dot" :class="{'active': currentShow==='cd'}"></span>
                  <span class="dot" :class="{'active': currentShow==='lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                  <span class="time time-l">{{timeFormat(currentTime)}}</span>
                  <div class="progress-bar-wrapper">
                    <progress-bar :percent="percent" @changeProgress="changeProgress"></progress-bar>
                  </div>
                  <span class="time time-r">{{timeFormat(durationTime)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="modeChange">
                        <i :class="iconMode"></i>
                    </div>
                    <div class="icon i-left" :class="disableCls">
                        <i @click="prev" class="icon-prev"></i>
                    </div>
                    <div class="icon i-center">
                        <i @click="setPlaying" :class="[playing?'icon-pause':'icon-play']"></i>
                    </div>
                    <div class="icon i-right" :class="disableCls">
                        <i @click="next" class="icon-next"></i>
                    </div>
                    <div class="icon i-right">
                        <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name='mini'>
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
              <div class="imgWrapper" ref="miniWrapper">
                <img :class="cdCls" style="border-radius: 50%" width="40" height="40" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
              <progress-circle :percent="percent" :radius="radius">
                <i :class="iconMini" class="icon-mini" @click.stop="setPlaying"></i>
              </progress-circle>
            </div>
            <div class="control" @click.stop="showPlaylist">
                <i class="icon-playlist"></i>
            </div>
        </div>
        </transition>
        <play-list ref="playList"></play-list>
        <audio ref="audio" 
               :src="currentSong.url" 
               @play="ready" 
               @error="error"
               @timeupdate="timeUpdate"
               @ended="end">
        </audio>
        
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar.vue'
import ProgressCircle from 'base/progress-cicle/progress-cicle.vue'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll.vue'
import {prefixStyle} from 'common/js/dom.js'
import PlayList from 'components/playlist/playlist.vue'
import {playerMixin} from 'common/js/mixin.js'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        durationTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
        ...mapGetters([
            'fullScreen',
            'currentIndex'
        ]),
        iconMini() {
          return this.playing?'icon-pause-mini':'icon-play-mini'
        },
        cdCls() {
          return this.playing?'play':'pause'
        },
        disableCls() {
          return this.songReady?'':'disable'
        },
        // 歌曲播放进程
        percent() {
          return this.currentTime/this.currentSong.duration
        }
        
    },
    watch: {
        currentSong(newSong, oldSong) {
            if(!newSong.id) {
              return
            }
            if(newSong.id === oldSong.id) {
              return
            }
            if(this.currentLyric) {
              this.currentLyric.stop()
              this.currentTime = 0
              this.playingLyric = ''
              this.currentLIneNum = 0 
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.$refs.audio.play()
                this.getLyric()
                this.durationTime = this.currentSong.duration    
            }, 1000)
        },
        playing(newPlaying) {
          this.$nextTick(()=>{
            const audio = this.$refs.audio
            newPlaying?audio.play():audio.pause()
          }) 
        }
        
    },
    created() {
      this.touch = {}
    },
    methods: {
        back() {
            this.setFullScreen(false)
        },
        open() {
            this.setFullScreen(true)
        },
        enter(el, done) {
            const {x, y, scale} = this._getPosAndScale() 
            let animation = {
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style.transform = ''
        },
        _getPosAndScale() {
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth*0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth/2-paddingLeft)
            const y = window.innerHeight-paddingTop-width/2-paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        setPlaying() {
          this.setPlayState(!this.playing)
          if(this.currentLyric) {
            this.currentLyric.togglePlay()
          }
        },
        next() {
          if(!this.songReady) {
            return
          }
          if(this.playlist.length === 1) {
            this.loop()
            return
          } else {
            let index = this.currentIndex+1
            if(index===this.playlist.length) {
              index = 0
            }
            this.setCurrentIndex(index)
            if(!this.playing) {
              this.setPlaying()
            }
          }
          this.songReady = false
        },
        prev() {
          if(!this.songReady) {
            return
          }
          if(this.playlist.length === 1) {
            this.loop()
            return
          } else {
            let index = this.currentIndex-1
            if(index<0) {
              index = this.playlist.length-1
            }
            this.setCurrentIndex(index)
            if(!this.playing) {
              this.setPlaying()
            }
          }
          this.songReady = false
        },
        ready() {
          this.songReady = true
          this.savePlayHistory(this.currentSong)
        },
        error() {
          this.songReady = true
        },
        // 当歌曲播放时就会触发timeupdate事件，相应的触发timeUpdate函数
        timeUpdate(e) {
          this.currentTime = e.target.currentTime
        },
        // 格式化时间字符串
        timeFormat(interval) {
          interval = interval | 0
          let minute = interval/60 | 0
          let second = (interval%60).toString().padStart(2, '0')
          return `${minute}:${second}`
        },
        changeProgress(percent) {
          const currentTime = this.currentSong.duration*percent
          this.$refs.audio.currentTime = currentTime
          if(!this.playing) {
            this.setPlaying()
          }
          if(this.currentLyric) {
            this.currentLyric.seek(currentTime*1000)
          }
        },
        // 当歌曲播放完后，audio标签并不会自动播放下一曲，而是提供了一个ended事件
        end() {
          if(this.mode === playMode.loop) {
            this.loop()
          } else {
            this.next()
          }
          
        },
        // 歌曲循环
        loop() {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if(this.currentLyric) {
            this.currentLyric.seek(0)
          }
        },
        // 获取当前播放歌曲的歌词
        getLyric() {
          this.currentSong.getLyric().then((lyric)=>{
            if(this.currentSong.lyric !== lyric) {
              return
            }
            this.currentLyric = new Lyric(lyric, this.handleLyric)
            if(this.playing) {
              this.currentLyric.play()
            }
            console.log(this.currentLyric)
          }).catch(()=>{
            this.currentLyric = null
            this.playingLyric = ''
            this.currentLineNum = 0
          })
        },
        // new Lyric()的参数，回调函数
        handleLyric({lineNum, txt}) {
          this.currentLineNum = lineNum
          this.playingLyric = txt
          if(lineNum>5) {
            let lineEl = this.$refs.lyricLine[lineNum-5]
            this.$refs.lyricList.scrollToElement(lineEl, 1000)
          } else {
            this.$refs.lyricList.scrollTo(0, 0, 1000)
          }
        },
        middleTouchstart(e) {
          this.touch.inited = true
          this.touch.startX = e.touches[0].pageX
          this.touch.startY = e.touches[0].pageY
        },
        middleMove(e) {
          if(!this.touch.inited) {
            return
          }
          let delaX = e.touches[0].pageX - this.touch.startX
          let delaY = e.touches[0].pageY - this.touch.startY
          if(Math.abs(delaX)<Math.abs(delaY)) {
            return
          }
          const left = this.currentShow==='cd'?0:-window.innerWidth
          const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left+delaX))
          this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
          this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
          this.$refs.lyricList.$el.style[transitionDuration] = 0
          const opacity = 1 - this.touch.percent
          this.$refs.cdWrapper.style.opacity = opacity
          this.$refs.cdWrapper.style[transitionDuration] = 0
        },
        touchEnd(e) {
          let offsetWidth
          let opacity
          if(this.currentShow==='cd') {
            if(this.touch.percent>0.1) {
              offsetWidth = -window.innerWidth
              this.currentShow = 'lyric'
              opacity = 0
            } else {
              offsetWidth = 0
              opacity = 1
            }
          } else {
            if(this.touch.percent<0.9) {
              offsetWidth = 0
              this.currentShow = 'cd'
              opacity = 1
            } else {
              offsetWidth = -window.innerWidth
              opacity = 0
            }
          }
          const time = 300
          this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
          this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
          this.$refs.cdWrapper.style.opacity = opacity
          this.$refs.cdWrapper.style[transitionDuration] = `${time}ms`
        },
        // 点击歌曲列表按钮，显示播放的歌曲列表
        showPlaylist() {
          this.$refs.playList.show()
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN'
        }),
        ...mapActions([
          'savePlayHistory'
        ])
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
                &.play
                  animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active 
        transition: all 0.4s
        .top, .bottom
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)  
    
    
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
