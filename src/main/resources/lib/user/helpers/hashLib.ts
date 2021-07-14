import { UserWithProfile } from "enonic-types/auth";

const authLib = __non_webpack_require__("/lib/xp/auth");
const textEncoding = __non_webpack_require__("/lib/text-encoding");
const utils = __non_webpack_require__("/lib/util");

export { activateUserHash, saveHashForUser, getUserByHash, generateHash };

function generateHash(name: string) {
  var salt = "userHashSalt";
  return textEncoding.md5(salt + name + new Date().getTime());
}

function saveHashForUser(email: string, hashType: string): string {
  var hash = generateHash(email);
  var user = findUser(email);
  if (!user) return "";
  var profile = authLib.modifyProfile({
    key: user.key,
    editor: editor
  });

  return profile[hashType];

  function editor(c: any) {
    if (!c) {
      c = {};
    }
    c[hashType] = hash;
    return c;
  }
}

function getUserByHash(mail: string, hash: string, hashType: string) {
  const user = findUser(mail);
  if (!user) {
    return false;
  }
  const userProfile: any = authLib.getProfile({
    key: user.key
  });
  if (userProfile && userProfile[hashType] == "1") {
    return true;
  } else if (
    !userProfile ||
    (userProfile && !userProfile[hashType]) ||
    (userProfile && userProfile[hashType] && userProfile[hashType] !== hash)
  ) {
    return false;
  }
  return user;
}

function activateUserHash(mail: string, hash: string, hashType: string) {
  var user = getUserByHash(mail, hash, hashType);
  if (user === true) {
    return true;
  } else if (!user) {
    return false;
  }
  var profile = authLib.modifyProfile({
    key: user.key,
    editor: editor
  });

  function editor(c: any) {
    if (!c) {
      c = {};
    }
    c[hashType] = "1";
    return c;
  }
  return true;
}

function findUser(name: string) {
  var user = authLib.findUsers({
    start: 0,
    count: 1,
    query: 'email="' + name + '" OR login="' + name + '"'
  });
  if (user.hits.length > 0) {
    return user.hits[0];
  }
  return null;
}
