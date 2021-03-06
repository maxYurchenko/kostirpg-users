const authLib = __non_webpack_require__("/lib/xp/auth");
const utils = __non_webpack_require__("/lib/util");

export { addRole, checkRole };
import * as contextLib from "./../helpers/contextLib";

function addRole(roleId: string, userKey: string) {
  contextLib.runAsAdmin(function () {
    authLib.addMembers("role:" + roleId, [userKey]);
  });
}

function checkRole(roles: string | string[]): boolean {
  roles = utils.data.forceArray(roles);
  for (var i = 0; i < roles.length; i++) {
    if (authLib.hasRole(roles[i])) {
      return true;
    }
  }
  return false;
}
