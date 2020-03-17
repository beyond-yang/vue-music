<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        listenScroll: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        setTimeout(()=>{
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll() {
            if(!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })
            
            // 监听scroll事件
            if(this.listenScroll) {
               let That = this
               this.scroll.on('scroll', (pos)=>{
                   That.$emit('scroll', pos)
               })
            }
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch: {
        data() {
            setTimeout(()=>{
                this.refresh()
            }, 20)
        }
    }
}
</script>