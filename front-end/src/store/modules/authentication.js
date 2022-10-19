import axios from 'axios';
import { make } from 'vuex-pathify';
import router from '../../router'

const state = {
    token: null
};

// "set" prefix, constant case. e.g: SET_FOO
const mutations = {
    ...make.mutations(state)
}

// "set" prefix, camel case. e.g: setFoo
const actions = {
    login: ({commit}, { login, password }) => {
        return new Promise((resolve, reject) => {
            axios.post('/login', {
                login,
                password
            })
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('token', token);

                commit('token', { token: token });
                axios.defaults.headers.common['Authorization'] = token;
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        }); 
    },

    logout: ({commit}) => {
        commit('token', null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        router.replace('/login');
    },
    ...make.actions(state)
}

// no prefix, no case conversion. e.g: foo
const getters = {
    isAuthenticated (state) {
        console.log('state.token: ' + state.token);
        return state.token !== null
    },
    ...make.getters(state)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
