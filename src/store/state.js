import {playMode} from 'common/js/config.js'
import {storageReload, loadPlay, loadFavorite} from 'common/js/cache.js'
const state = {
    singer: {},//当前歌手信息
    playing: false,//播放器播放状态
    fullScreen: false,//是否全屏显示
    playlist: [],//歌曲播放列表
    sequenceList: [],//歌曲顺序播放列表
    mode: playMode.sequence,
    currentIndex: -1,//当前歌曲播放的索引
    disc: {},
    toplist: {},
    searchHistory: storageReload(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
}

export default state