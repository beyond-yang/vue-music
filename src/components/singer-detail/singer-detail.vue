<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer.js";
import { createSong, isValidMusic, processSongsUrl } from "common/js/song.js";
import MusicList from "components/music-list/music-list.vue";
import { ERR_OK } from "api/config.js";
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    // console.log(this.singer)
    this._getsingerDetail();
  },
  components: {
    MusicList
  },
  methods: {
    _getsingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          // this.singerDetailList = res.data.list
          // this.songs = this._normalizeSongs(res.data.list)
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs;
          });
          // console.log(this.singerDetailList)
          // console.log(this.songs)
        }
      });
    },
    // 处理歌手数据，从歌手数据的musicData属性中抽离歌手详情页需要的歌手数据
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        // if(musicData.songid && musicData.albummid) {
        //     ret.push(createSong(musicData))
        // }
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import './../../common/stylus/variable.styl';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>