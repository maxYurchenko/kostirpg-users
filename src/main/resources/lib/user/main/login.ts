const authLib = __non_webpack_require__("/lib/xp/auth");

import * as contextLib from "./../helpers/contextLib";
import { getCurrentUser } from "./currUser";
import { findUser } from "./../utils/helpers";

export { login };

function login(name: string, pass?: string, token?: boolean) {
  if (!token) {
    token = false;
  }
  var user = contextLib.runAsAdmin(function () {
    return findUser(name);
  });
  if (!user) {
    return {
      exist: false,
      message: "Пользователь не найден."
    };
  }
  var loginResult = authLib.login({
    user: user.login,
    password: pass,
    skipAuth: token
  });
  if (loginResult.authenticated === true) {
    return {
      user: getCurrentUser(),
      exist: true,
      authenticated: true
    };
  } else {
    return {
      exist: false,
      message: "Не верный пароль."
    };
  }
}
