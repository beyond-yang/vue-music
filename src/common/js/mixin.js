import {
    playMode
} from 'common/js/config.js'
import {
    shuffle
} from 'common/js/util.js'
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    },
}

// playlist.vue和player.vue共享了模式切换的逻辑
export const playerMixin = {
    computed: {
        // 播放歌曲模式
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            'mode',
            'sequenceList',
            'currentSong',
            'playlist',
            'playing',
            'favoriteList'
        ])
    },
    methods: {
        // 点击播放模式按钮，切换歌曲的播放模式
        modeChange() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        // currentSong是通过playlist和currentIndex计算出来的，当播放模式改变时，
        // 要想使currentSong不改变，那么就要计算这首歌在当前播放列表的索引值
        resetCurrentIndex(list) {
            const index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            console.log(this.currentSong)
            this.setCurrentIndex(index)

        },
        toggleFavorite(currentSong) {
            if (this.isFavorite(currentSong)) {
                this.cancelFavorite(currentSong)
            } else {
                this.saveFavorite(currentSong)
            }
        },
        getFavoriteIcon(currentSong) {
            if (this.isFavorite(currentSong)) {
                return 'icon-favorite'
            } else {
                return 'icon-not-favorite'
            }
        },
        isFavorite(currentSong) {
            const index = this.favoriteList.findIndex((item) => {
                return currentSong.id === item.id
            })
            return index > -1
        },
        ...mapMutations({
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayState: 'SET_PLAYING_STATE'
        }),
        ...mapActions([
            'saveFavorite',
            'cancelFavorite'
        ])
    }
}

// add-song组件和search组件共享了搜索历史的业务逻辑
export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 110
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        inputBlur() {
            this.$refs.searchBox.blur()
        },
        saveSearch(item) {
            this.saveSearch(item)
        },
        getQuery(newQuery) {
            this.query = newQuery
        },
        // 点击热门搜索关键字后，
        addQuery(item) {
            this.$refs.searchBox.setQuery(item)
        },
        ...mapActions([
            'saveSearch', //保存搜索历史
            'deleteHistoryOne' //删除搜索历史的某条数据
        ])
    }
}