import Vue from 'vue'
import VueRouter from 'vue-router'
import Rank from './../components/rank/rank.vue'
import Recommend from './../components/recommend/recommend.vue'
import Search from './../components/search/search.vue'
import Singer from './../components/singer/singer.vue'
import SingerDetail from 'components/singer-detail/singer-detail.vue'
import Disc from 'components/disc/disc.vue'
import rankDetail from 'components/rank-detail/rank-detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: rankDetail
      }
    ]
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
