<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.item" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" alt class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item.item"
          :data-index="index"
          class="item"
          :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading :title="title"></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll.vue";
import { getData } from "common/js/dom.js";
import Loading from "base/loading/loading.vue";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0, //用来显示歌手页面的快速入口中的哪个显示高亮
      diff: -1,
      title: "正在载入中……"
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    // 计算出歌手页面右侧快速入口的数据数组
    shortcutList() {
      return this.data.map(item => {
        return item.title.substr(0, 1);
      });
    },
    // 计算出fixedTitle栏的title
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  created() {
    (this.touch = {}),
      (this.probeType = 3),
      (this.listenScroll = true),
      (this.scrollHeight = []);
  },
  methods: {
    // 快速入口的touchStart事件
    onShortcutTouchStart(e) {
      // console.log(e)
      this.touch.y1 = e.touches[0].pageY;
      // 调用封装好的方法，算出被点击的元素的索引值
      let anchorIndex = getData(e.target, "index");
      this.touch.anchorIndex = anchorIndex;
      this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0);
      this._scrollTo(anchorIndex);
    },
    // 快速入口的touchMove事件
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let moveIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(moveIndex);
    },
    _scrollTo(index) {
      if (!index && index != 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.scrollHeight.length - 2) {
        index = this.scrollHeight.length - 2;
      }
      console.log(index);
      // this.scrollY = this.scrollHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0);
    },
    // scroll函数为了调用scroll.vue子组件的监听的scroll方法，把pos.y参数传递给该组件，使this.scrollY = pos.y
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 计算出各个歌手ABCD……选项呈现时需要滚动的高度，放在this.scrollHeight数组中
    _calculateHeight() {
      this.scrollHeight = [];
      const list = this.$refs.listgroup;
      let height = 0;
      this.scrollHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight;
        this.scrollHeight.push(height);
      }
    },
    selectItem(item) {
      this.$emit("select", item);
    },
    refresh() {
      this.$refs.listview.refresh();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    // 算出currentIndex对应歌手页面右侧的点
    scrollY(newY) {
      const scrollHeight = this.scrollHeight;
      // 当滚动到顶部时，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间位置滚动时
      for (let i = 0; i < scrollHeight.length - 1; i++) {
        let height1 = scrollHeight[i];
        let height2 = scrollHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          // console.log(this.currentIndex)
          return;
        }
      }
      // 滚动到底部时
      this.currentIndex = scrollHeight.length - 2;
    },
    // 通过实时计算diff，计算出fixedTitle框的移动距离
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import './../../common/stylus/variable';

* {
  touch-action: pan-x;
}

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>