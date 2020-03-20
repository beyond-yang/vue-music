<template>
    <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result"> 
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" :title="'正在加载中……'"></loading>
        </ul>
    </scroll>
    
</template>

<script>
import {search} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,
            hasMore: true
        }
    },
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    created() {

    },
    methods: {
        // 当搜索关键字改变的时候，请求服务器接口，获取数据
        _search() {
            this.hasMore = true
            this.page = 1
            this.$refs.suggest.scrollTo(0, 0)
            search(this.query, this.page, this.showSinger, perpage).then((res) => {
                if(res.code === ERR_OK) {
                    this.result = this._genResult(res.data)
                    console.log(res.data)
                    this._checkMore(res.data.song)
                }
            })
        },
        searchMore() {
            if(!this.hasMore) {
                return
            }
            this.page++
            search(this.query, this.page, this.showSinger, perpage).then((res)=>{
                if(res.code === ERR_OK) {
                    this.result = this.result.concat(this._genResult(res.data))
                }
            })
        },
        _checkMore(song) {
            if(!song.list.length || (song.curnum + song.curpage *perpage) > song.totalnum) {
                this.hasMore = false
            }
        },
        // 格式化请求到的数据
        _genResult(data) {
            let ret = []
            if(data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if(data.song) {
                ret = ret.concat(this._normalize(data.song.list))
            }
            return ret
        },
        // 把获取到的歌曲列表数据处理为一个Song类
        _normalize(list) {
            let songs = []
            list.forEach((musicData)=>{
                if(musicData.songid && musicData.albumid)
                songs.push(createSong(musicData))
            })
            return songs
        },
        // 根据数据类型应用相应的图标样式
        getIconCls(item) {
            if(item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        // 把获取到的数据中的歌名和歌手名渲染到DOM中
        getDisplayName(item) {
            if(item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        }
    },
    watch: {
        query() {
            this._search()
        }
    },
    components: {
        Scroll,
        Loading
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
