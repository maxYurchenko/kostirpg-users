const contentLib = __non_webpack_require__("/lib/xp/content");
import * as contextLib from "./../helpers/contextLib";
import { User as KostiUser } from "../../../site/content-types/user/user";
import { getCurrentUser } from "./currUser";

export { editUser };

function editUser(data: UserUpdateData) {
  var currUser = getCurrentUser();
  if (!currUser || currUser.content._id !== data.id) {
    return null;
  }
  var user = contentLib.modify<KostiUser>({
    key: currUser.content._id,
    editor: function (node) {
      node.displayName = data.displayName ? data.displayName : node.displayName;
      node.data.firstName = data.firstName
        ? data.firstName
        : node.data.firstName;
      node.data.lastName = data.lastName ? data.lastName : node.data.lastName;
      node.data.city = data.city ? data.city : node.data.city;
      node.data.phone = data.phone ? data.phone : node.data.phone;
      node.data.address = data.address ? data.address : node.data.address;
      node.data.country = data.country ? data.country : node.data.country;
      node.data.telegram = data.telegram ? data.telegram : node.data.telegram;
      node.data.postalCode = data.postalCode
        ? data.postalCode
        : node.data.postalCode;
      return node;
    }
  });
  contextLib.runAsAdminAsUser(currUser.user, function () {
    contentLib.publish({
      keys: [user._id],
      sourceBranch: "master",
      targetBranch: "draft",
      includeDependencies: false
    });
  });
  return true;
}

interface UserUpdateData {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  phone?: string;
  address?: string;
  country?: string;
  postalCode?: string;
  telegram?: string;
}
