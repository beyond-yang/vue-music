import Vue from 'vue'
import VueRouter from 'vue-router'

const Rank = () => import('components/rank/rank.vue')
const Recommend = () => import('components/recommend/recommend.vue')
const Search = () => import('components/search/search.vue')
const Singer = () => import('components/singer/singer.vue')
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const Disc = () => import('components/disc/disc.vue')
const rankDetail = () => import('components/rank-detail/rank-detail.vue')
const UserCenter = () => import('components/user-center/user-center.vue')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [{
      path: ':id',
      component: rankDetail
    }]
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Disc
    }]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/user',
    name: 'User',
    component: UserCenter
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router