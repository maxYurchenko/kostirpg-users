const thymeleaf = __non_webpack_require__("/lib/thymeleaf");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");
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
      message: i18nLib.localize({
        key: "global.user.userNotExists",
        locale: "ru"
      })
    };
  }
  var loginResult = authLib.login({
    user: user.login,
    password: pass,
    skipAuth: token
  });
  if (loginResult.authenticated === true) {
    return {
      html: thymeleaf.render(
        resolve("../pages/components/header/headerUser.html"),
        {
          user: getCurrentUser()
        }
      ),
      exist: true,
      authenticated: true
    };
  } else {
    return {
      exist: false,
      message: i18nLib.localize({
        key: "global.user.incorrectPass",
        locale: "ru"
      })
    };
  }
}
