const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");

import * as contextLib from "./../helpers/contextLib";

import * as hashLib from "./../helpers/hashLib";
import { findUser } from "./helpers";
import { getImage } from "./../main/image";

import { Content } from "enonic-types/content";
import { User as KostiUser } from "../../../site/content-types/user/user";

export { getSystemUser, getUserDataById, activateUser, sendConfirmationMail };

function getSystemUser(name: string, keyOnly?: boolean) {
  var user = contextLib.runAsAdmin(function () {
    return findUser(name);
  });
  if (!user) {
    return false;
  }
  if (keyOnly) {
    return user.key;
  }
  return user;
}

function getUserDataById(id: string) {
  if (!id) {
    return {
      displayName: "Пользователь удален",
      url: null,
      image: getImage(undefined, "block(32,32)"),
      _id: null,
      key: null
    };
  }
  var user: Content<KostiUser> | null = contentLib.get({ key: id });
  if (!user || !user.data) {
    return {
      displayName: "Пользователь удален",
      url: null,
      image: getImage(undefined, "block(32,32)"),
      _id: null,
      key: null
    };
  }
  return {
    displayName: user.displayName,
    url: portal.pageUrl({ id: user._id }),
    image: getImage(user.data.userImage, "block(32,32)"),
    _id: user._id,
    key: getSystemUser(user.data.email, true)
  };
}

function activateUser(mail: string, hash: string) {
  return contextLib.runAsAdmin(function () {
    return hashLib.activateUserHash(mail, hash, "registerHash");
  });
}

function sendConfirmationMail(mail: string) {
  var hash = hashLib.saveHashForUser(mail, "registerHash");
}
