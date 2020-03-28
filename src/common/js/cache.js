import storage from 'good-storage'

const CACHE_KEY = '__search__'
const ARR_MAX = 15
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100

function findIndex(list, item) {
    return list.findIndex((listItem)=>{
        return listItem === item
    })
}
function insertQuery(arr, val, compare, maxlen) {
    let index = arr.findIndex(compare)
    if(index === 0) {
        return 
    }
    if(index>0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if(maxlen && arr.length>maxlen) {
        arr.pop()
    }

}
// 把搜索历史缓存到本地存储中，页面中的搜索历史数据来源于本地，以便页面刷新后还能显示数据
export function searchHistory(query) {
    let searches = storage.get(CACHE_KEY, [])
    insertQuery(searches, query, (item)=>{
        return item === query
    }, ARR_MAX)
    storage.set(CACHE_KEY, searches)
    return searches
}

// 获取本地存储的搜索历史数据
export function storageReload() {
    return storage.get(CACHE_KEY, [])
}

// 删除本地存储的某条数据，把最新的本地历史搜索数据返回
export function storageDeleteOne(deleteItem) {
    let searches = storage.get(CACHE_KEY, [])
    let index = findIndex(searches, deleteItem)
    if(index>-1) {
        searches.splice(index, 1)
    }
    storage.set(CACHE_KEY, searches)
    return searches
}

// 清空本地中的所有歌曲搜索历史数据
export function storageDeleteAll() {
    storage.remove(CACHE_KEY)
    return []
}

// 把最近播放的歌曲缓存到本地，页面中最近播放列表中的数据来源于本地，以便页面刷新后还有数据
export function savePlay(song) {
    let recentPlaySongs = storage.get(PLAY_KEY, [])
    insertQuery(recentPlaySongs, song, (item)=>{
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, recentPlaySongs)
    return recentPlaySongs
}

// 获取本地存储中的最近播放歌曲数据
export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}