import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import routes from './routes';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/',
    linkActiveClass: 'active',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (localStorage.getItem('token')) {
            next();
            return;
        }

        next('/login');
        return;
    }

    next();
});

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start();
    }

    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;