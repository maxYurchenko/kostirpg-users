import { User } from "../../../site/content-types/user/user";

const common = __non_webpack_require__("/lib/xp/common");
const authLib = __non_webpack_require__("/lib/xp/auth");
const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");

export { checkUserExists, findUser, checkUserNameExists };

function checkUserExists(name?: string, mail?: string) {
  if (mail) {
    let user = authLib.findUsers({
      start: 0,
      count: 1,
      query: 'email="' + mail + '"'
    });
    if (user.total > 0) {
      return {
        exist: true,
        type: "mail"
      };
    }
  }
  if (name) {
    let user = authLib.findUsers({
      start: 0,
      count: 1,
      query: 'login="' + name + '"'
    });
    if (user.total > 0) {
      return {
        exist: true,
        type: "login"
      };
    }
    user = authLib.findUsers({
      start: 0,
      count: 1,
      query: '_name="' + common.sanitize(name) + '"'
    });
    if (user.total > 0) {
      return {
        exist: true,
        type: "name"
      };
    }
  }
  return {
    exist: false
  };
}

function findUser(name: string) {
  var user = authLib.findUsers({
    start: 0,
    count: 1,
    query: 'email="' + name + '" OR login="' + name + '"'
  });
  if (user && user.hits && user.hits[0]) {
    return user.hits[0];
  }
  return false;
}

function checkUserNameExists(name: string) {
  let site: any = portal.getSiteConfig();
  let usersLocation = contentLib.get({ key: site.userLocation });
  if (!usersLocation) return null;
  let query = contentLib.query<User>({
    query:
      "_name = '" +
      name +
      "' and _parentPath='/content" +
      usersLocation._path +
      "'",
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (query.total > 0) {
    return query.hits[0];
  }
  return null;
}
