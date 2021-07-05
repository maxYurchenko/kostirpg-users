const authLib = __non_webpack_require__("/lib/xp/auth");
const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");

import * as contextLib from "./../helpers/contextLib";

import { checkRole } from "../utils/roles";
import { createUserContentType } from "../utils/createContentType";
import { getImage } from "./image";

import { User as KostiUser } from "../../../site/content-types/user/user";
import { Content } from "enonic-types/content";
import { UserAllData } from "../../types/user";

export { getCurrentUser };

function getCurrentUser(): UserAllData | null {
  const user = authLib.getUser();
  let userObj: Content<KostiUser>;
  if (user && user.email) {
    const query = contentLib.query<KostiUser>({
      query: "data.email = '" + user.email + "'",
      start: 0,
      count: 1,
      contentTypes: [app.name + ":user", "com.myurchenko.kostirpg:user"]
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
  return {
    url: portal.pageUrl({ id: userObj._id }),
    image: getImage(userObj.data.userImage, "block(32,32)"),
    roles: {
      moderator: checkRole(["role:moderator", "role:system.admin"]),
      gameMaster: checkRole(["role:gameMaster"]),
      admin: checkRole(["role:system.admin"]),
      moscowGM: checkRole(["role:moscowgm"]),
      moscowPlayer: checkRole(["role:moscow-player"])
    },
    notificationsCounter: notificationLib.getNotificationsForUser(userObj._id)
  };
}
