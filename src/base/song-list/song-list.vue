<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song, index) in songs"
        :key="song.id"
        class="item"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}.${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", song, index);
    },
    getRankCls(index) {
      if (index < 3) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index >= 3) {
        return index + 1;
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import './../../common/stylus/variable.styl';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          background-image: url('./first@2x.png');
          // bg-image('first')
        }

        &.icon1 {
          background-image: url('./second@2x.png');
          // bg-image('second')
        }

        &.icon2 {
          background-image: url('./third@2x.png');
          // bg-image('third')
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
