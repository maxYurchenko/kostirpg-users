const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const common = __non_webpack_require__("/lib/xp/common");

const permissions = __non_webpack_require__("./permissions");
const contextLib = __non_webpack_require__("./contextLib");

import { Content } from "enonic-types/content";
import { User as KostiUser } from "../../../site/content-types/user/user";

export { createUserContentType };

function createUserContentType(
  displayName: string,
  mail: string,
  userKey: string,
  name?: string
) {
  let site: any = portal.getSiteConfig();
  var usersLocation = contentLib.get({ key: site.userLocation });
  let user: Content<KostiUser> = contextLib.runInDraft(function () {
    user = contentLib.create({
      parentPath: usersLocation ? usersLocation._path : "/",
      name: name ? common.sanitize(name) : common.sanitize(displayName),
      displayName: displayName,
      contentType: app.name + ":user",
      language: "ru",
      data: {
        email: mail
      }
    });
    contentLib.setPermissions({
      key: user._id,
      inheritPermissions: false,
      overwriteChildPermissions: true,
      permissions: permissions.default(userKey)
    });
    return user;
  });

  contentLib.publish({
    keys: [user._id],
    sourceBranch: "draft",
    targetBranch: "master"
  });
  return user;
}
