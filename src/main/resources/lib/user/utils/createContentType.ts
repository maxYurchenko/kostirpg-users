const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const common = __non_webpack_require__("/lib/xp/common");

import * as contextLib from "./../helpers/contextLib";

import { Content, PermissionsParams } from "enonic-types/content";
import { User } from "../../../site/content-types/user/user";
import { checkUserNameExists } from "../utils/helpers";

export { createUserContentType };

function createUserContentType(
  displayName: string,
  mail: string,
  userKey?: string,
  name?: string,
  phone?: string
) {
  let site: any = portal.getSiteConfig();
  let usersLocation = contentLib.get({ key: site.userLocation });
  let permissions = userKey ? permission(userKey) : null;
  let userName = name ? common.sanitize(name) : common.sanitize(displayName);
  let existingContentType = checkUserNameExists(userName);
  if (existingContentType) {
    var date = new Date();
    userName = userName + "-" + date.getTime();
  }
  let user: Content<User> = contextLib.runInDraft(function () {
    user = contentLib.create<User>({
      parentPath: usersLocation ? usersLocation._path : "/",
      name: userName,
      displayName: displayName,
      contentType: app.name + ":user",
      language: "ru",
      data: {
        email: mail,
        kmgPlayer: false,
        phone: phone
      }
    });
    if (permissions) {
      contentLib.setPermissions({
        key: user._id,
        inheritPermissions: false,
        overwriteChildPermissions: true,
        permissions: permissions
      });
    }
    return user;
  });

  contentLib.publish({
    keys: [user._id],
    sourceBranch: "draft",
    targetBranch: "master"
  });
  return user;
}

function permission(user: string): Array<PermissionsParams> {
  return [
    {
      principal: user,
      allow: [
        "READ",
        "CREATE",
        "MODIFY",
        "PUBLISH",
        "READ_PERMISSIONS",
        "WRITE_PERMISSIONS"
      ],
      deny: ["DELETE"]
    },
    {
      principal: "role:system.everyone",
      allow: ["READ"],
      deny: []
    }
  ];
}
