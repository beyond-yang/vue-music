import jsonp from 'common/js/jsonp.js'
import {commonParams, options} from 'api/config.js'
import axios from 'axios'
const debug = process.env.NODE_ENV !== 'production'
// 封装获取热门搜索关键字的jsonp请求
export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5',
        format: jsonp
    })
    return jsonp(url, data, options)
}

// 封装获取由搜索关键字，请求服务器的搜索到的列表
// export function search(query, page, zhida, perpage) {
//     const url = debug ? '/api/search' : 'http://ustbhuangyi.com/music/api/search'
//     const data = Object.assign({}, commonParams, {
//         w: query,
//         p: page,
//         perpage,
//         n: perpage,
//         catZhida: zhida ? 1 : 0,
//         zhidaqu: 1,
//         t: 0,
//         flag: 1,
//         ie: 'utf-8',
//         sem: 1,
//         aggr: 0,
//         remoteplace: 'txt.mqq.all',
//         uin: 0,
//         needNewCode: 1,
//         platform: 'h5',
//         format: 'json'
//     })
//     return axios.get(url, {
//         params: data
//     }).then((res)=>{
//         return Promise.resolve(res.data)
//     })
// }

export function search (query, page, zhida, perpage) {
    const url = debug ? '/api/search' : 'http://ustbhuangyi.com/music/api/search'
  
    const data = Object.assign({}, commonParams, {
      w: query,
      p: page,
      perpage,
      n: perpage,
      catZhida: zhida ? 1 : 0,
      zhidaqu: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      remoteplace: 'txt.mqq.all',
      uin: 0,
      needNewCode: 1,
      platform: 'h5',
      format: 'json'
    })
  
    return axios.get(url, {
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
}
