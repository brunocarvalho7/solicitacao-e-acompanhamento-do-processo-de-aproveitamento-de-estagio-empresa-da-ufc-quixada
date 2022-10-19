import { make } from 'vuex-pathify';

const state = {
    drawer: null,
    drawerImage: true,
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
        }
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
    ...make.getters(state)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}