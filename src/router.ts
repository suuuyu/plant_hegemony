import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('./views/Play.vue'),
    },
    {
      path: '/end',
      name: 'end',
      component: () => import('./views/End.vue'),
    },
  ],
});
