import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data)=>{
            if(!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

// 把字符串对象转化为查询字符串参数的形式
function param(data) {
    let queryStr = ''
    for (var key in data) {
        let value = data[key] !== undefined ? data[key] : ''
        queryStr += `&${key}=${encodeURIComponent(value)}`
    }
    return queryStr ? queryStr.substr(1) : ''
}