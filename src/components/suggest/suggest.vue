<template>
    <scroll ref="suggest" 
            class="suggest" 
            :data="result" 
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll">
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="item in result"> 
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" :title="'正在加载中……'"></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <no-result :title='title'></no-result>
        </div>
    </scroll>
    
</template>

<script>
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import Singer from 'common/js/singer.js'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'base/no-result/no-result.vue'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,
            hasMore: true,
            title: '抱歉！暂无此歌曲',
            beforeScroll: true
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
                 
                    this._genResult(res.data).then((result)=>{
                        this.result = result
                        setTimeout(()=>{
                            this._checkMore(res.data)
                        }, 20)
                    })
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
                    this._genResult(res.data).then((result)=>{
                        this.result = this.result.concat(result)
                        setTimeout(() => {
                            this._checkMore(res.data)
                        }, 20)
                    })
                }
            })
        },
        _checkMore(data) {
            const song = data.song
            if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
            this.hasMore = false
            } else {
                if (!this.$refs.suggest.scroll.hasVerticalScroll) {
                    this.searchMore()
                }
            }
        },
        // 格式化请求到的数据
        _genResult(data) {
            let ret = []
            if(data.zhida && data.zhida.singerid && this.page === 1) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
    
            return processSongsUrl(this._normalize(data.song.list)).then((songs)=>{
                ret = ret.concat(songs)
                return ret
            })
        },
        // 把获取到的歌曲列表数据处理为一个Song类
        _normalize(list) {
            let songs = []
            list.forEach((musicData)=>{
                if(isValidMusic(musicData)) {
                    songs.push(createSong(musicData))
                }
                
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
        },
        // 点击搜索到的列表后跳转到歌手详情页或歌曲详情页
        selectItem(item) {
            if(item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                // 显示当前播放的歌曲页面
                this.insertSong(item)
            }
            this.$emit('searchItem', item.name)      
        },
        // 当suggest滚动时派发出事件
        listScroll() {
            this.$emit('inputBlur')
        },
        refresh() {
            this.$refs.suggest.refresh()
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch: {
        query() {
            this._search()
        }
    },
    components: {
        Scroll,
        Loading,
        NoResult
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  * {
      touch-action: pan-x
  }
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
