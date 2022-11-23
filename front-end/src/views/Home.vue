<template>
    <student-onboarding v-if="isStudent" />
</template>

<script>
    import { getUserRoles } from '@/helpers/userHelpers';

    export default {
        name: 'HomePage',
        components: {
            StudentOnboarding: () => import(
                /* webpackChunkName: "student-onboarding" */
                '@/components/StudentOnboarding'
            ),
        },
        data () {
            return {
                isStudent: true,
            }
        },
        mounted() {
            const userRoles = getUserRoles();

            this.isStudent = userRoles && userRoles[0] === 'student';
        }
    }
</script>
