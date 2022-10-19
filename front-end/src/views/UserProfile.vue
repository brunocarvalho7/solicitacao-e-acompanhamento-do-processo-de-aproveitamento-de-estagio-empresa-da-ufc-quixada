<template>
    <v-container id="user-profile-view" fluid>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <material-card color="primary" icon="mdi-account-outline">
                    <template #title>
                        Perfil
                    </template>

                    <v-form>
                        <v-container class="py-0">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field readonly label="Nome Completo" :value="name" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field readonly label="CPF" :value="login" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field readonly label="Curso" :value="course" />
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field readonly label="Email" :value="email" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </material-card>
            </v-col>

            <v-col cols="12" md="4">
                <app-card class="mt-4 text-center">
                         <v-icon class="information-icon">
                        mdi-information-outline
                    </v-icon>

                    <v-card-text class="text-center">
                        <h6 class="text-h6 mb-2 text--secondary">
                            Importante
                        </h6>

                        <p class="text--secondary">
                            <span class="d-block">Todas as informação exibidas aqui são obtidas diretamente da Base Centralizada da UFC Quixadá.</span>
                            <span class="d-block mt-2">Para realizar qualquer modificação nessas informações, é necessário fazer login e realizar essa operação diretamente naquele sistema. </span>
                            <span class="d-block mt-2">Essa informação será refletida aqui após o próximo login. </span>
                        </p>

                        <v-btn class="mr-0" color="primary" min-width="100" rounded @click="goToBaseCentralizada">
                            Acessar Base Centralizada
                        </v-btn>
                    </v-card-text>
                </app-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';

  export default { 
    name: 'UserProfileView',
    computed: {
        ...get('user', [
            'name',
            'login',
            'course',
            'email'
        ])
    },
    mounted() {
        dispatch('user/getUserProfile');
    },
    methods: {
        goToBaseCentralizada: function () {
            window.open('https://identidadepessoa.quixada.ufc.br', '_blank');
        }
    }
}
</script>

<style>
    .information-icon {
        font-size: 70px !important;
    }
</style>
