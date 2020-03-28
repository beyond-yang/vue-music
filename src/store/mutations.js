import * as types from './mutation-types.js'
import { playlist } from './getters.js'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, playlist) {
        state.playlist = playlist
    },
    [types.SET_SEQUENCE_LIST](state, sequenceList) {
        state.sequenceList = sequenceList
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, currentIndex) {
        state.currentIndex = currentIndex
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_TOPLIST](state, toplist) {
        state.toplist = toplist
    },
    [types.SET_SEARCH_HISTORY](state, searchHistory) {
        state.searchHistory = searchHistory
    },
    [types.SET_PLAY_HISTORY](state, playHistory) {
        state.playHistory = playHistory
    }
}


export default mutations