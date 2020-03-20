<template>
  <transition appear name="slide">
    <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list.vue'
import {mapGetters} from 'vuex'
import  {getMusicList} from 'api/rank.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'
import {processSongsUrl} from 'common/js/song.js'
    export default {
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        computed: {
            ...mapGetters([
                'toplist'
            ]),
            title() {
                return this.toplist.topTitle
            },
            bgImage() {
                if(this.songs.length>0) {
                    return this.songs[0].image
                }
            }
        },
        created() {
            this._getMusicList()
        },
        methods: {
            _getMusicList() {
                getMusicList(this.toplist.id).then((res)=>{
                    if(!this.toplist.id) {
                        this.$router.push({
                            path: '/rank'
                        })
                    }
                    if(res.code === ERR_OK) {
                        processSongsUrl(this._normalize(res.songlist)).then((songs)=>{
                            this.songs = songs
                            console.log(this.songs)
                        })
                        
                    }
                })
            },
            _normalize(list) {
                let ret = []
                list.forEach((item)=>{
                    let musicData = item.data
                    if(musicData.songid&&musicData.songname) {
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

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
