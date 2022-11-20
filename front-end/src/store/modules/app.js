import { make } from 'vuex-pathify';
import { isAccessAuthorized } from '@/helpers/userHelpers';
import Roles from '@/router/roles';

const state = {
    drawer: null,
    drawerImage: true,
    version: "1.0.0",
    mini: false,
    items: [
        {
            title: 'Dashboard',
            icon: 'mdi-view-dashboard',
            to: '/',
        },
        {
            title: 'Perfil',
            icon: 'mdi-account',
            to: '/components/profile/',
        },
        {
            title: 'Convênios',
            icon: 'mdi-clipboard-outline',
            to: '/components/partners',
        },
        {
            title: 'Coordenadores',
            icon: 'mdi-account-group-outline',
            to: '/components/coordinators',
            roles: [Roles.SUPER_ADMIN]
        },
        {
            title: 'Processo',
            icon: 'mdi-view-dashboard',
            to: '/components/process',
            roles: [Roles.STUDENT]
        },
        {
            title: 'Processos',
            icon: 'mdi-view-dashboard',
            to: '/components/processes',
            roles: [Roles.COORDINATOR]
        },
    ]
}

// "set" prefix, constant case. e.g: SET_FOO
const mutations = {
    ...make.mutations(state)
}

// "set" prefix, camel case. e.g: setFoo
const actions = {
    ...make.actions(state)
}

// no prefix, no case conversion. e.g: foo
const getters = {
    allowedMenuItems (state) {
        return state.items.filter(function (itemMenu) {
            return isAccessAuthorized(itemMenu.roles);
        });
    },
    ...make.getters(state)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}