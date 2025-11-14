/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router';
// import { routes } from 'vue-router/auto-routes'
import index from '@/pages/index.vue';
import login from '../pages/Login.vue';
import HomeWorkList from '@/pages/dashboard/HomeWorkList.vue';
import ChangePassword from '@/pages/dashboard/ChangePassword.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: index,
    children: [
      {
        path: 'homework',
        name: 'homework',
        component: HomeWorkList,
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: ChangePassword,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
  {
    path: '/puzzle',
    name: 'PuzzleView',
    component: () => import('@/pages/PuzzleView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err);
    } else {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
