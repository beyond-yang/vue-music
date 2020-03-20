<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songsList"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list.vue'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import {createSong, processSongsUrl} from 'common/js/song.js'
export default {
    data() {
        return {
            songsList: []
        }
    },
    computed: {
        ...mapGetters([
            'disc'
        ]),
        title() {
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        }
    },
    created() {
        this._getSongList(this.disc.dissid)
    },
    methods: {
        // 获取用于渲染歌单详情列表的歌曲数据
        _getSongList(id) {
            if(!id) {
                this.$router.push({
                    path: '/recommend'
                })
            }
            getSongList(id).then((res)=>{
                if(res.code === ERR_OK) {

                    // this.songsList = this._normalize(res.cdlist[0].songlist)
                    processSongsUrl(this._normalize(res.cdlist[0].songlist)).then((songs)=>{
                        this.songsList = songs
                        console.log(this.songsList)
                    })
                    
                }
            })
        },
        // 格式化获取到的歌单详情页的歌曲数据
        _normalize(list) {
            let ret = []
            list.forEach((musicData)=>{
                if(musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        }
    },
    components: {
        MusicList
    }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>

