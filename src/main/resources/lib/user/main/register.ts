const authLib = __non_webpack_require__("/lib/xp/auth");
const common = __non_webpack_require__("/lib/xp/common");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");
const httpClientLib = __non_webpack_require__("/lib/http-client");
const utils = __non_webpack_require__("/lib/util");

import * as contextLib from "./../helpers/contextLib";

import * as hashLib from "./../helpers/hashLib";

import { updateUserSocial } from "./../social/socialUtils";
import { createUserContentType } from "./../utils/createContentType";
import { createUserImageObj } from "./image";
import { checkUserExists } from "./../utils/helpers";
import { login } from "./login";
import { sendUserMail } from "../helpers/userMailslib";

export { register };

function register(
  name: string,
  mail: string,
  pass?: string,
  tokenRegister?: boolean,
  image?: string,
  otherData?: object
) {
  var displayName = name;
  var exist = contextLib.runAsAdmin(function () {
    return checkUserExists(name, mail);
  });
  if (exist.exist && exist.type === "mail" && tokenRegister) {
    if (otherData) {
      contextLib.runAsAdmin(function () {
        updateUserSocial(mail, otherData);
      });
    }
    return login(mail, pass, tokenRegister);
  } else if (exist.exist && exist.type === "name" && tokenRegister) {
    var date = new Date();
    name = name + "-" + date.getTime();
  } else if (exist.exist) {
    exist.message = i18nLib.localize({
      key: "global.user." + exist.type + "Exists",
      locale: "ru"
    });
    return exist;
  }
  var user = contextLib.runAsAdmin(function () {
    return authLib.createUser({
      idProvider: "system",
      name: common.sanitize(name),
      displayName: name,
      email: mail
    });
  });
  var userObj = contextLib.runAsAdminAsUser(user, function () {
    return createUserContentType(displayName, mail, user.key, name);
  });
  if (image) {
    var response = httpClientLib.request({
      url: image,
      method: "GET"
    });
    var responseStream = response.bodyStream;
    contextLib.runAsAdmin(function () {
      createUserImageObj(responseStream, userObj);
    });
  }
  if (otherData) {
    contextLib.runAsAdmin(function () {
      updateUserSocial(mail, otherData);
    });
  }
  if (!tokenRegister && pass) {
    var activationHash = contextLib.runAsAdmin(function () {
      authLib.changePassword({
        userKey: user.key,
        password: pass
      });
      return hashLib.saveHashForUser(mail, "registerHash");
    });
    var sent = sendUserMail("userActivation", mail, {
      hash: activationHash
    });
  }
  if (tokenRegister) {
    return login(mail, pass, tokenRegister);
  } else if (userObj) {
    return login(mail, pass);
  } else {
    return false;
  }
}
