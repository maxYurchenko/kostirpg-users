const authLib = __non_webpack_require__("/lib/xp/auth");
const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");

const contextLib = __non_webpack_require__("./contextLib");

import { checkRole } from "../utils/roles";
import { createUserContentType } from "../utils/createContentType";
import { getImage } from "./image";

import { User as KostiUser } from "../../../site/content-types/user/user";
import { Content } from "enonic-types/content";

export { getCurrentUser };

function getCurrentUser() {
  const user = authLib.getUser();
  let userObj: Content<KostiUser>;
  if (user && user.email && user.displayName) {
    const query = contentLib.query<KostiUser>({
      query: "data.email = '" + user.email + "'",
      start: 0,
      count: 1,
      contentTypes: [app.name + ":user"]
    });
    if (!(query.hits && query.hits[0])) {
      userObj = contextLib.runAsAdminAsUser(user, function () {
        return createUserContentType(user.displayName, user.email, user.key);
      });
    }
    return {
      user: user,
      content: query.hits[0],
      data: beautifyUser(query.hits[0])
    };
  }
  return null;
}

function beautifyUser(userObj: Content<KostiUser>) {
  const notificationLib = require("./../utils/notificationLib");
  if (!userObj?.data?.userImage) return null;
  return {
    url: portal.pageUrl({ id: userObj._id }),
    image: getImage(userObj.data.userImage, "block(32,32)"),
    roles: {
      moderator: checkRole(["role:moderator", "role:system.admin"]),
      gameMaster: checkRole(["role:gameMaster", "role:system.admin"]),
      admin: checkRole(["role:system.admin"])
    },
    notificationsCounter: notificationLib.getNotificationsForUser(userObj._id)
  };
}
