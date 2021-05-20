const authLib = __non_webpack_require__("/lib/xp/auth");

const contextLib = __non_webpack_require__("./contextLib");

import * as hashLib from "./../helpers/hashLib";
import * as mailsLib from "./../helpers/mailsLib";

import { checkUserExists } from "./helpers";

export { resetPass, forgotPass, setNewPass };

function resetPass(email: string) {
  if (!email || email == "") {
    return {
      status: 404,
      message: "Пользователь не найден."
    };
  }
  var userExist = contextLib.runAsAdmin(function () {
    return checkUserExists(undefined, email).exist;
  });
  if (!userExist) {
    return {
      status: 404,
      message: "Пользователь не найден."
    };
  }
  var hash = contextLib.runAsAdmin(function () {
    return hashLib.saveHashForUser(email, "resetPassHash");
  });
  mailsLib.sendMail("forgotPass", email, { hash: hash });
  return {
    status: 200,
    message: "Инструкции отправленны вам на почту."
  };
}

function forgotPass(email: string, hash: string) {
  var user = contextLib.runAsAdmin(function () {
    return hashLib.getUserByHash(email, hash, "resetPassHash");
  });
  if (user && user !== true) {
    return user.key;
  }
  return false;
}

function setNewPass(password: string, email: string, hash: string) {
  return contextLib.runAsAdmin(function () {
    var user = forgotPass(email, hash);
    if (user) {
      authLib.changePassword({
        userKey: user,
        password: password
      });
      hashLib.activateUserHash(email, hash, "resetPassHash");
      return true;
    }
    return false;
  });
}
