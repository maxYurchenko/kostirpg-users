const contextLib = __non_webpack_require__("./contextLib");
const authLib = __non_webpack_require__("/lib/xp/auth");
const utils = __non_webpack_require__("/lib/util");

export { addRole, checkRole };

function addRole(roleId: string, userKey: string) {
  contextLib.runAsAdmin(function () {
    authLib.addMembers("role:" + roleId, [userKey]);
  });
}

function checkRole(roles: string | string[]) {
  roles = utils.data.forceArray(roles);
  for (var i = 0; i < roles.length; i++) {
    if (authLib.hasRole(roles[i])) {
      return true;
    }
  }
  return false;
}
