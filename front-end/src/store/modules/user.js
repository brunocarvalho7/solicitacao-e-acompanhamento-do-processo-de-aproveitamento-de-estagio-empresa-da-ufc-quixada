// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios';
import store from '@/store';

// Globals
// import { IN_BROWSER } from '@/util/globals'

const state = {
    name: '',
    login: '',
    course: '',
    email: '',
    id: '',
  dark: false,
  drawer: {
    image: 0,
    gradient: 0,
    mini: false,
  },
  gradients: [
    'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
    'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)',
    'rgba(244, 67, 54, .8), rgba(244, 67, 54, .8)',
  ],
  images: [],
  notifications: [],
  rtl: false,
}

const mutations = {
    ...make.mutations(state),
    setProfileData: (state, profileData) => {
        ['id', 'name', 'login', 'course', 'email'].forEach(function (attribute) {
            const value = profileData[attribute];

            if (value) {
                state[attribute] = profileData[attribute];
            }
        });

        if (profileData.roles) {
            store.commit('authentication/roles', profileData.roles);
        }
    }
}

const actions = {
    getUserProfile: ({ commit }) => {
        return new Promise((resolve, reject) => {
            axios.get('/profile')
            .then(res => {
                commit('setProfileData', res.data);
                resolve(res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            });
        });
    },
    updateProfile: ({ commit, state }, coordinator) => {
        return new Promise((resolve, reject) => {
            const endpoint = `/coordinators/${state.id}`;

            axios.patch(endpoint, coordinator)
            .then(res => {
                if (res.data.success) {
                    const token = res.data.token;
    
                    commit('setProfileData', coordinator);

                    if (token) {
                        store.commit('authentication/token', token);
                    }
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
  fetch: ({ commit }) => {
    const local = localStorage.getItem('vuetify@user') || '{}'
    const user = JSON.parse(local)

    for (const key in user) {
      commit(key, user[key])
    }

    if (user.dark === undefined) {
      commit('dark', window.matchMedia('(prefers-color-scheme: dark)'))
    }
  },
  update: ({ state }) => {
    //if (!IN_BROWSER) return

    localStorage.setItem('vuetify@user', JSON.stringify(state))
  },
}

const getters = {
  dark: (state, getters) => {
    return (
      state.dark ||
      getters.gradient.indexOf('255, 255, 255') === -1
    )
  },
  gradient: state => {
    return state.gradients[state.drawer.gradient]
  },
  image: state => {
    return state.drawer.image === '' ? state.drawer.image : state.images[state.drawer.image]
  },
  salutation: state => {
    let firstName = state.name && state.name.split(' ')[0];

    return `Olá, ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}`;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
