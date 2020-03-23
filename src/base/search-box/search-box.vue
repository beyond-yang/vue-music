<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="input" class="box" v-model="query" :placeholder="placeholder"/>
        <i class="icon-dismiss" v-show='query' @click='dissQuery'></i>
    </div>
</template>

<script>
import {debounce} from 'common/js/util.js'
export default {
    data() {
        return {
            query: ''
        }
    },
    props: {
        placeholder: {
            type: String,
            default: '搜索歌手 歌曲'
        }
    },
    created() {
        this.$watch('query', debounce((newQuery)=>{
            this.$emit('query', newQuery)
        }, 200))
    },
    methods: {
        dissQuery() {
            this.query = ''
        },
        setQuery(query) {
            this.query = query
        },
        blur() {
            this.$refs.input.blur()
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  
  *
    touch-action: pan-x
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>