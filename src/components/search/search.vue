<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotkey" :key="item.n">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @deleteOne="deleteHistoryOne" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" :query="query" @inputBlur="inputBlur" @searchItem="saveSearch"></suggest>
    </div>
    <confirm
      @clearAll="deleteHistoryAll"
      ref="confirm"
      :title="confirmTitle"
      :confirmBtnText="confirmBtnText"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box.vue";
import { getHotKey } from "api/search.js";
import { ERR_OK } from "api/config.js";
import Suggest from "components/suggest/suggest.vue";
import { mapActions, mapGetters } from "vuex";
import SearchList from "base/search-list/search-list.vue";
import Confirm from "base/confirm/confirm.vue";
import Scroll from "base/scroll/scroll.vue";
import { playlistMixin, searchMixin } from "common/js/mixin.js";
export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotkey: [],
      confirmTitle: "确认清除搜索历史吗？",
      confirmBtnText: "清除"
    };
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory);
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  created() {
    this._getHotKey();
  },
  methods: {
    // 获取热门搜索关键字
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
        }
      });
    },

    // 点击后显示清除或取消模态框
    showConfirm() {
      this.$refs.confirm.show();
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    ...mapActions([
      "deleteHistoryAll" //清空全部搜索历史数据
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
