import store from '@/store';

function isAccessAuthorized (routeRoles) {
    const userRoles = store.getters['authentication/roles'];

    if (!routeRoles || !routeRoles.length) {
        return true;
    }

    return routeRoles.some(function (role) {
        return userRoles.includes(role);
    });
}

function isUserRoleSet() {
    const userRoles = store.getters['authentication/roles'].length;

    return !!userRoles;
}

export { 
    isAccessAuthorized,
    isUserRoleSet,
};
