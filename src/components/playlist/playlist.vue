<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click="modeChange"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
                    </h1>
                </div>
                <scroll :refreshDelay="refreshDelay" ref="listContent" class="list-content" :data="sequenceList">
                    <transition-group name="list" tag="ul">
                        <li :key="item.id" @click="selectItem(item, index)" 
                            class="item" 
                            v-for="(item, index) in sequenceList" 
                            ref="listItem">
                            <i class="current" :class="iconPlay(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i class="icon-not-favorite"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="showAddSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @clearAll="clearAll" :title="title" :confirmBtnText="confirmBtnText"></confirm>
            <add-song ref="addsong"></add-song>
        </div>
    </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'
import {mapActions} from 'vuex'
import {playMode} from 'common/js/config.js'
import Confirm from 'base/confirm/confirm.vue'
import {playerMixin} from 'common/js/mixin.js'
import AddSong from 'components/add-song/add-song.vue'
export default {
    mixins: [playerMixin],
    data() {
        return {
            showFlag: false,
            title: '确认清除歌曲列表中所有数据吗？',
            confirmBtnText: '清除',
            refreshDelay: 110
        }
    },
    computed: {
        modeText() {
          return this.mode===playMode.sequence?'顺序播放':this.mode===playMode.random?'随机播放':'循环播放'
        }
    },
    methods: {
        show() {
            this.showFlag = true
            setTimeout(()=>{
              this.$refs.listContent.refresh()  
              this.scrollToCurrent(this.currentSong)     
            }, 20)
            
        },
        hide() {
            this.showFlag = false
        },
        iconPlay(item) {
          if(this.currentSong.id === item.id) {
            return 'icon-play'
          } else {
            return ''
          }
        },
        // 点击播放列表中某一首歌曲跳转到这首歌曲
        selectItem(item, index) {
          if(this.mode === playMode.random) {
            index = this.playlist.findIndex((song)=>{
              return song.id === item.id
            })
          }
          this.setCurrentIndex(index)
          this.setPlayState(true)
        },
        // 在播放列表中，如果可以滚动的话，当前播放歌曲总滚动到第一行
        scrollToCurrent(current) {
          const index = this.sequenceList.findIndex((song)=>{
            return current.id === song.id
          })
          this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
        },
        deleteOne(item) {
          this.deleteSong(item)
          if(!this.playlist.length) {
            this.hide()
          }
        },
        // 点击垃圾桶按钮，清除所有播放列表数据
        showConfirm() {
          this.$refs.confirm.show()
        },
        clearAll() {
          this.clearListAll()
        },
        // 显示add-song.vue组件
        showAddSong() {
          this.$refs.addsong.show()
        },
        ...mapActions([
          'deleteSong',
          'clearListAll'
        ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!this.showFlag || newSong.id === oldSong.id) {
          return 
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>