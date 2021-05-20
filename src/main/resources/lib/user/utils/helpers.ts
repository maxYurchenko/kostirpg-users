const common = __non_webpack_require__("/lib/xp/common");
const authLib = __non_webpack_require__("/lib/xp/auth");

export { checkUserExists, findUser };

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
