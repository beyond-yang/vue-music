var express = require('express')
var compression = require('compression')
// var config = require('./vue.config.js')
var axios = require('axios')
const bodyParser = require('body-parser')

// var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

// 请求QQ音乐端接口，获取用于渲染轮播图的数据
apiRoutes.get('/api/getTopBanner', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    const jumpPrefix = 'https://y.qq.com/n/yqq/album/'
    axios.get(url, {
        headers: {
            referer: 'https://y.qq.com/',
            host: 'u.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        response = response.data
        if (response.code === 0) {
            const slider = []
            const content = response.focus.data && response.focus.data.content
            if (content) {
                for (let i = 0; i < content.length; i++) {
                    const item = content[i]
                    const sliderItem = {}
                    sliderItem.id = item.id
                    sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                    sliderItem.picUrl = item.pic_info.url
                    slider.push(sliderItem)
                }
            }
            res.json({
                code: 0,
                msg: 'suc',
                data: {
                    slider
                }
            })
        } else {
            res.json({
                code: 1,
                msg: 'fail',
                data: ''
            })
        }
    }).catch((e) => {
        console.log(e)
    })
})

// 请求QQ音乐接口，获取用于渲染热门歌单推荐的数据
apiRoutes.get('/api/getSongRecList', (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

// 请求QQ音乐接口，获取歌曲的url地址
apiRoutes.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.post(url, req.body, {
        headers: {
            referer: 'https://y.qq.com',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

// 请求QQ音乐接口，获取歌词
apiRoutes.get('/api/lyric', function (req, res) {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        let ret = response.data
        if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
                ret = JSON.parse(matches[1])
            }
        }
        res.json(ret)
    }).catch((e) => {
        console.log(e)
    })
})

// 请求QQ音乐接口，获取歌单详情页的歌曲列表数据
apiRoutes.get('/api/getSongList', function (req, res) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        let ret = response.data
        if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
                ret = JSON.parse(matches[1])
            }
        }
        res.json(ret)
    }).catch((e) => {
        console.log(e)
    })
})

// 请求服务器接口，获取搜索列表
apiRoutes.get('/api/search', function (req, res) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

app.use(apiRoutes)

app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(8000, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + 8000 + '\n')
})
