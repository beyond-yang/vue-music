import * as types from './mutation-types.js'
import { shuffle } from 'common/js/util.js'
import { playMode } from 'common/js/config.js'
import { searchHistory, storageDeleteOne, storageDeleteAll, savePlay } from 'common/js/cache.js'

function findIndex(list, song) {
    return list.findIndex((item)=>{
        return item.id === song.id
    })
}
export const selectPlay = function ({commit, state}, {list, index}) {
    
    commit(types.SET_SEQUENCE_LIST, list)
    if(state.mode === playMode.random) {
        let randomList = shuffle(list)
        console.log(randomList)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({commit, state}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    
}

// 把歌曲插入到播放列表中
export const insertSong = function ({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 当前播放歌曲
    let currentSong = playlist[currentIndex]
    // 先查询playlist列表中有无当前播放歌曲，有的话返回索引位置
    const fIndex = findIndex(playlist, song)
    // 要把歌曲插曲到playlist中，所以index++
    currentIndex++
    // 把点击到的歌曲插入到playlist列表中
    playlist.splice(currentIndex, 0, song)
    // 判断playlist中是否已有要插入的歌曲，
    //并且比较已有歌曲和插入歌曲的索引位置，做出不同情况的处理

    //fIndex>-1证明playlist列表中已有插入的歌曲
    if(fIndex>-1) {
        // 插入歌曲索引>已有歌曲索引
        if(currentIndex>fIndex) {
            //删除已有歌曲
            playlist.splice(fIndex, 1)
            currentIndex--
        } else {
            playlist.splice(fIndex+1, 1)
        }
    }

    // 歌曲插入到sequencelist中的位置
    const currentSIndex = findIndex(sequenceList, currentSong)+1
    const sIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if(sIndex>-1) {
        if(currentIndex>sIndex) {
            sequenceList.splice(sIndex, 1)
        } else {
            sequenceList.splice(sIndex+1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 提交搜索历史并将搜索历史保存到本地
export const saveSearch = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, searchHistory(query))
}

//删除搜索历史中的某条数据
export const deleteHistoryOne = function ({commit}, deleteItem) {
    commit(types.SET_SEARCH_HISTORY, storageDeleteOne(deleteItem))
}

// 清空所有的歌曲搜索历史
export const deleteHistoryAll = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, storageDeleteAll())
}

// 删除播放列表中的某条歌曲
export const deleteSong = function ({commit, state}, deleteSong) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let index = findIndex(playlist, deleteSong)
    playlist.splice(index, 1)
    let SIndex = findIndex(sequenceList, deleteSong)
    sequenceList.splice(SIndex, 1)
    if(index < currentIndex || currentIndex === playlist.length) {
        currentIndex--
    }
    
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    if(!playlist.length) {
        commit(types.SET_PLAYING_STATE, false)
    } else {
        commit(types.SET_PLAYING_STATE, true)
    }
}

// 清除播放列表中的所有数据
export const clearListAll = function ({commit}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

// 每播放一首歌曲时，保存播放历史
export const savePlayHistory = function ({commit}, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
} 