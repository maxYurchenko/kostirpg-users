const httpClientLib = __non_webpack_require__("/lib/http-client");
const portal = __non_webpack_require__("/lib/xp/portal");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { User } from "../../../site/content-types/user/user";
import { SocialResponse } from "../../types/social";
import { getCurrentUser } from "../main/currUser";
import { getUserBySocial, updateUserSocial } from "./socialUtils";
import { register as reg } from "../main/register";

export { getVkData, vkRegister };

function vkRegister(token: string, redirect?: string) {
  const data = register(token);
  if (data) return reg(data.name, data.email, undefined, true, data.picture);
  return null;
}

function register(code: string, redirect?: string): SocialResponse | null {
  const token = getToken(code, redirect);
  if (!token) return null;
  let data = getUserDataForRegister(token);
  if (!data) return null;
  const user = getCurrentUser();
  const socialUser = data.id ? getUserBySocial({ vk: data.id }) : null;
  if (user?.content?.data?.vk) {
    return updateUserSocial(user.content.data.email, { vk: data.id });
  } else if (socialUser && data && data.id) {
    return {
      name: data.first_name + " " + data.last_name,
      email: socialUser.data.email,
      picture: data.photo_max_orig,
      otherData: { vk: data.id }
    };
  } else if (data && token.email && (data.first_name || data.last_name)) {
    return {
      name: data.first_name + " " + data.last_name,
      email: token.email,
      picture: data.photo_max_orig,
      otherData: { vk: data.id }
    };
  }
  return null;
}

function getVkData(id: string): UserData | null {
  let user = contentLib.get<User>({ key: id });
  if (user && user.data && user.data.vk) {
    const url =
      "https://api.vk.com/method/users.get?v=5.102&user_ids=" +
      user.data.vk +
      "&access_token=" +
      app.config.vkservicekey;
    let response = httpClientLib.request({
      url: url,
      method: "GET"
    });
    if (response.status === 200 && response.body) {
      let body = JSON.parse(response.body);
      if (body.response && body.response[0]) body = body.response[0];
      if (body.first_name && body.last_name) return body;
    }
  }
  return null;
}

function getToken(code: string, redirect?: string): Token | null {
  var site = portal.getSite();
  var url =
    "https://oauth.vk.com/access_token?" +
    "client_id=7018935&client_secret=5qh6sNny1XFW73sPEQXw&" +
    "code=" +
    code +
    "&" +
    "redirect_uri=" +
    portal.pageUrl({ path: site._path, type: "absolute" }) +
    (redirect ? redirect : "user/auth/vk");
  var request = httpClientLib.request({
    url: url,
    method: "GET"
  });
  if (!request.body) return null;
  return JSON.parse(request.body);
}

function getUserDataForRegister(token: Token): UserData | null {
  const url =
    "https://api.vk.com/method/users.get?v=5.102&uid=" +
    token.user_id +
    "&fields=photo_max_orig" +
    "&access_token=" +
    token.access_token;
  const data = httpClientLib.request({
    url: url,
    method: "GET"
  });
  if (!data || !data.body) {
    return null;
  }
  return JSON.parse(data.body).response[0];
}

interface Token {
  user_id: string;
  access_token: string;
  email: string;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  photo_max_orig?: string;
}
