const contentLib = __non_webpack_require__("/lib/xp/content");

import * as sharedLib from "./../helpers/sharedLib";
import { getCurrentUser } from "./../main/currUser";

import { User } from "../../../site/content-types/user/user";
import { SocialMedia } from "../../types/social";

export { updateUserSocial, getUserBySocial };

function getUserBySocial(data: SocialMedia) {
  if (!data) {
    return null;
  }
  let query = undefined;
  if (data.facebook) {
    query = "data.facebook = '" + data.facebook + "'";
  }
  if (data.discord) query = "data.discord = '" + data.discord + "'";
  if (data.vk) query = "data.vk = '" + data.vk + "'";
  let user = contentLib.query<User>({ query: query, count: 1 });
  if (user.total > 0) return user.hits[0];
  return null;
}

function updateUserSocial(email: string, data: SocialMedia) {
  if (!email || !data) return null;

  const query = contentLib.query<User>({
    query: "data.email = '" + email + "'",
    count: 1,
    start: 0,
    contentTypes: [app.name + ":user"]
  });
  if (query.total !== 1) return null;
  let user = query.hits[0];
  const currUser = getCurrentUser();

  if (
    data.discord &&
    (!user.data.discord || user.data.discord !== data.discord)
  ) {
    user.data.discord = data.discord;
  }

  if (data.vk && (!user.data.vk || user.data.vk !== data.vk)) {
    user.data.vk = data.vk;
  }

  if (
    data.facebook &&
    (!user.data.facebook || user.data.facebook !== data.vk)
  ) {
    user.data.facebook = data.facebook;
  }

  return sharedLib.updateEntity(
    user,
    currUser && currUser.user ? currUser.user : undefined
  );
}
