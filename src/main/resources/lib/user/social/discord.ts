const httpClientLib = __non_webpack_require__("/lib/http-client");
const portal = __non_webpack_require__("/lib/xp/portal");
const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

import { User } from "../../../site/content-types/user/user";
import { SocialResponse } from "../../types/social";
import { getCurrentUser } from "../main/currUser";
import { getUserBySocial, updateUserSocial } from "./socialUtils";

import { register as reg } from "../main/register";

export { register, getDiscordData, discordRegister };

function discordRegister(token: string, redirect?: string) {
  const data = register(token, redirect);
  if (data) return reg(data.name, data.email, undefined, true, data.picture);
  return null;
}

function register(code: string, redirect?: string): SocialResponse | null {
  let token = getToken(code, redirect);
  let data = getUserDataForRegister(token);
  if (!data) return null;

  const user = getCurrentUser();
  const socialUser = data.id ? getUserBySocial({ discord: data.id }) : null;
  if (user && data && data.id) {
    updateUserSocial(user.content.data.email, { discord: data.id });
    return {
      name: data.username,
      email: user.content.data.email,
      picture: data.avatar
        ? "https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar
        : undefined,
      otherData: { discord: data.id }
    };
  } else if (socialUser && data && data.id) {
    return {
      name: data.username,
      email: socialUser.data.email,
      picture: data.avatar
        ? "https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar
        : undefined,
      otherData: { discord: data.id }
    };
  } else if (data && data.email && data.username) {
    return {
      name: data.username,
      email: data.email,
      picture: data.avatar
        ? "https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar
        : undefined,
      otherData: { discord: data.id }
    };
  }
  return null;
}

function getDiscordData(id: string) {
  let user = contentLib.get<User>({ key: id });
  if (user && user.data && user.data.discord) {
    let response = httpClientLib.request({
      url: "https://discordapp.com/api/users/" + user.data.discord,
      method: "GET",
      headers: {
        Authorization: "Bot " + app.config.discordbottoken
      }
    });
    if (response.status === 200) {
      if (!response.body) return null;
      let data: UserData = JSON.parse(response.body);
      if (data.id && data.username) return data;
    }
  }
  return null;
}

function getToken(code: string, redirect?: string) {
  const site = portal.getSite();
  let data =
    "&redirect_uri=" +
    portal.pageUrl({ path: site._path, type: "absolute" }) +
    (redirect ? redirect : "user/auth/discord");
  data += "&grant_type=authorization_code";
  data += "&scope=identify%20email";
  data += "&code=" + code;
  var request = httpClientLib.request({
    url: "https://discordapp.com/api/oauth2/token",
    method: "POST",
    body: data,
    contentType: "application/x-www-form-urlencoded",
    auth: {
      user: "605493268326776853",
      password: "wS6tHC4ygjIAo5gZNskzEpeetVOk0N62"
    }
  });
  if (!request.body) return null;
  return JSON.parse(request.body);
}

function getUserDataForRegister(token: Token): UserData | null {
  let request = httpClientLib.request({
    url: "https://discordapp.com/api/users/@me",
    method: "GET",
    contentType: "application/x-www-form-urlencoded",
    headers: {
      Authorization: token.token_type + " " + token.access_token
    }
  });
  if (!request.body) return null;
  return JSON.parse(request.body);
}

interface Token {
  token_type: string;
  access_token: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}
