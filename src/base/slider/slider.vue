<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex===index }"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom.js";
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  // 设置props属性，可以从外部控制这个组件的一些props属性
  props: {
    // 是否可以循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 默认可以自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 自动轮播的间隔
    interval: {
      type: Number,
      default: 2000
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this._setSliderGroupWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20); //浏览器的刷新通常在17ms一次，这个20ms算是科学经验值

    // 当浏览器窗口改变时，重新改变元素的宽度，刷新轮播图
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._setSliderGroupWidth(true);
      this.slider.refresh();
    });
  },
  destroyed() {
    // 当slider.vue这个组件被切换掉的时候，也就是被销毁的时候，会调用destroy生命周期函数
    // 当组件里面有计时器资源时，组件销毁时，要把计时器资源进行清理，有利于内存的释放
    clearTimeout(this.timer);
  },
  methods: {
    // 设置slider轮播图的宽度
    _setSliderGroupWidth(isResize) {
      // 1.获取到元素ref=slider的宽度sliderWidth
      // 2.获取ref=sliderGroup元素下的子元素的个数length，
      //   遍历sliderGroupChildren， sliderGroup元素的width为length*sliderWidth
      //   为每个子元素添加.slider-item类样式
      let sliderWidth = this.$refs.slider.clientWidth;
      let sliderGroup = this.$refs.sliderGroup;
      this.sliderGroupChildren = sliderGroup.children;
      let width = 0;
      for (let i = 0; i < this.sliderGroupChildren.length; i++) {
        let child = this.sliderGroupChildren[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      sliderGroup.style.width = width + "px";
    },
    // 初始化Dots
    _initDots() {
      this.dots = new Array(this.sliderGroupChildren.length);
    },
    // 初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      // 给轮播图添加一个scrollEnd事件监听，求出轮播图当前显示图片的index,使对应的dot高亮显示
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // if(this.loop) {
        //   pageIndex -= 1
        // }
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    // 实现自动轮播功能
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import './../../common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
