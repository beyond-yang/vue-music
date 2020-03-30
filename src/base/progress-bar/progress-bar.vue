  <template>
  <div class="progress-bar" ref="progressBar" @click="jumpPro">
    <div class="bar-inner">
      <div ref="progress" class="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom.js";
const progressBtnWidth = 16;
const transform = prefixStyle("transform");
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newParcent) {
      // 当歌曲的播放进度改变时，改变进度条播放的显示位置
      if (newParcent >= 0 && !this.touch.initied) {
        let progressBarWidth =
          this.$refs.progressBar.clientWidth - progressBtnWidth;
        let offsetWidth = progressBarWidth * newParcent;
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    touchStart(e) {
      this.touch.initied = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth; //当前的播放进度
    },
    touchMove(e) {
      if (!this.touch.initied) {
        return;
      }
      let deltX = e.touches[0].pageX - this.touch.startX;
      let offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltX)
      );
      this._offset(offsetWidth);
    },
    touchEnd(e) {
      this.touch.initied = false;
      // 派发一个事件，告诉父组件修改当前的播放进度
      this._triggerProgress();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    _triggerProgress() {
      let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      let percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("changeProgress", percent);
    },
    jumpPro(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      this._triggerProgress();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>  