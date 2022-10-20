exports.isResourceOwner = function isResourceOwner(currentUserId, resourceOwnerId) {
    return currentUserId === resourceOwnerId;
};
