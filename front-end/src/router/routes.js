import HelloWorldPage from '@/components/HelloWorld';
import LoginView from '@/views/Login';
import UserProfileView from '@/views/UserProfile';
import PartnersView from '@/views/Partners';
import CoordinatorsView from '@/views/Coordinators';
import NotFoundPage from '@/views/errors/NotFoundPage'
import AccessDeniedPage from '@/views/errors/AccessDeniedPage'
import ServerErrorPage from '@/views/errors/ServerErrorPage'

import DefaultLayout from '@/layouts/default/Index';

import { dispatch } from 'vuex-pathify';

import Roles from './roles';

export default [
    {
        path: '',
        component: DefaultLayout,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: HelloWorldPage,
            },
            {
                path: 'components/profile',
                name: 'Perfil',
                component: UserProfileView
            },
            {
                path: 'components/partners',
                name: 'Convênios',
                component: PartnersView
            },
            {
                path: 'components/coordinators',
                name: 'Cordenadores',
                component: CoordinatorsView,
                meta: {
                    roles: [
                        Roles.SUPER_ADMIN
                    ]
                }
            }
        ]
    },
    {
        path: '*',
        meta: {
            public: true
        },
        redirect: {
            path: '/404'
        }
    },
    {
        path: '/404',
        meta: {
            public: true
        },
        name: "NotFound",
        component: NotFoundPage
    },
    {
        path: '/403',
        meta: {
            public: true
        },
        name: "AccessDenied",
        component: AccessDeniedPage
    },
    {
        path: '/500',
        meta: {
            public: true
        },
        name: "ServerError",
        component: ServerErrorPage
    },
    {
        path: '/login',
        meta: {
            public: true
        },
        name: "Login",
        component: LoginView
    },
    {
        path: '/logout',
        name: 'Logout',
        beforeEnter () {
            dispatch('authentication/logout');
        }
    },
    {
        path: '/',
        meta: {
            public: true
        },
        name: "HelloWorld",
        component: HelloWorldPage
    }

]