<template>
    <div class="recommend" ref="recommend" >
        <scroll class="recommend-content" :data="songRecList" ref='scroll'>
        <div>
            <div class="slider-wrapper" v-if="recommendList.length">
              <slider>
                <div v-for="(item) in recommendList" :key="item.id">
                  <a :href="item.linkUrl">
                    <img class="needsclick" :src="item.picUrl" alt="bannerImg" @load="loadImage">
                  </a>
                </div>
              </slider>
            </div>
            <div class="recommend-list">
              <h1 class="list-title">热门歌单推荐</h1>
              <ul>
                  <li class="item" v-for="(item) in songRecList" :key="item.dissid">
                  <div class="icon">
                      <img width="60" height="60" v-lazy="item.imgurl">
                  </div>
                  <div class="text">
                      <h2 class="name">{{item.creator.name}}</h2>
                      <p class="desc">{{item.dissname}}</p>
                  </div>
                  </li>
              </ul>
            </div>
        </div>
        <div class="loading-container" v-show="!songRecList.length">
          <loading></loading>
        </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import { getRecommend, getSongRecList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import Slider from 'base/slider/slider.vue'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import {playlistMixin} from 'common/js/mixin.js'

export default {
    mixins: [playlistMixin],
    data() {
        return {
            recommendList: [],
            songRecList: []
        }
    },
    created() {
        this._getRecommed()
        this._getSongRecList()
    },
    methods: {
      // 请求数据接口，获取轮播图数据
        _getRecommed() {
            console.log(getRecommend())
            getRecommend().then((res)=>{
                if(res.code === ERR_OK) {
                    this.recommendList = res.data.slider
                }
            })
        },
      // 请求数据接口，获取歌单推荐数据
        _getSongRecList() {
          getSongRecList().then((res)=>{
            if(res.code === ERR_OK) {
              this.songRecList = res.data.list
            }
          })
        },
        loadImage() {
          
          if(!this.flag) {
            console.log('哈哈哈')
            this.$refs.scroll.refresh()
            this.flag = true
          }
          
        },
        handlePlaylist(playlist) {
          const bottom = playlist.length>0?'60px':''
          this.$refs.recommend.style.bottom = bottom
          this.$refs.scroll.refresh()
        }

    },
    components: {
      Slider,
      Scroll,
      Loading
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "./../../common/stylus/variable.styl"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>