import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import routes from './routes';
import { isAccessAuthorized, isUserRoleSet } from '@/helpers/userHelpers';
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
        const token = localStorage.getItem('token');

        if (!to.meta.public && !isUserRoleSet() && token) {
            next('/logout');
            return;
        } else if (token) {
            if (isAccessAuthorized(to.meta.roles)) {
                next();
                return;
            }

            next('/');
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