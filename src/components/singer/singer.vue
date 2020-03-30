<template>
  <div class="singer" ref="singer">
    <list-view @select="select" :data="singerList" ref="singerF"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer.js";
import { ERR_OK } from "api/config.js";
import Singer from "common/js/singer.js";
import ListView from "base/listview/listview.vue";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin.js";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    ListView
  },
  methods: {
    // 获取歌手页面的歌手相关数据
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalize(res.data.list);
          // console.log(this.singerList)
        }
      });
    },
    // 把获取的歌手原数据规范化为我们需要使用的数据
    _normalize(singerList) {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      };
      singerList.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.item.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          };
        }
        map[key].item.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      // console.log(map)
      // 把处理好的map对象转化为数组按a-z的有序列表
      // 先转化为数组再对数组进行排序
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      // console.log(hot.concat(ret))
      return hot.concat(ret);
    },
    // 点击某个歌手列表，通过传入歌手id，进行编程式路由，跳转到歌手详情页
    select(singer) {
      this.setSinger(singer);
      this.$router.push({
        path: `/singer/${singer.id}`
      });
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    handlePlaylist(palylist) {
      const bottom = palylist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.singerF.refresh();
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>