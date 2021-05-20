const httpClientLib = __non_webpack_require__("/lib/http-client");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { User } from "../../../site/content-types/user/user";
import { SocialResponse } from "../../types/social";
import { getCurrentUser } from "../main/currUser";
import { getUserBySocial, updateUserSocial } from "./socialUtils";

import { register as reg } from "../main/register";

export { register, getFacebookData, fbRegister };

function fbRegister(token: string, userId: string) {
  const data = register(token, userId);
  if (data) return reg(data.name, data.email, undefined, true, data.picture);
  return null;
}

function register(token: string, userId: string): SocialResponse | null {
  let data = getUserDataForRegister(token, userId);
  if (!data) return null;
  const user = getCurrentUser();
  const socialUser = data.id ? getUserBySocial({ facebook: data.id }) : null;
  if (user && data && data.id) {
    return updateUserSocial(user.content.data.email, { facebook: data.id });
  } else if (socialUser && data && data.id) {
    return {
      name: data.name,
      email: socialUser.data.email,
      picture:
        "https://graph.facebook.com/" +
        userId +
        "/picture?width=1900&height=1900",
      otherData: { facebook: data.id }
    };
  } else if (data && data.email && data.name) {
    return {
      name: data.name,
      email: data.email,
      picture:
        "https://graph.facebook.com/" +
        userId +
        "/picture?width=1900&height=1900",
      otherData: { facebook: data.id }
    };
  }
  return null;
}

function facebookLogin() {
  const url =
    "https://graph.facebook.com/oauth/access_token?client_id=" +
    app.config.facebookId +
    "&client_secret=" +
    app.config.facebookSecret +
    "&grant_type=client_credentials";
  let response = httpClientLib.request({
    url: url,
    method: "GET"
  });
  if (response.status === 200 && response.body) {
    const body = JSON.parse(response.body);
    if (body.access_token) return body;
  }

  return null;
}

function getFacebookData(id: string) {
  const token = facebookLogin();
  if (!token) return null;
  let user = contentLib.get<User>({ key: id });
  if (user?.data?.facebook) {
    const url =
      "https://graph.facebook.com/v10.0/" +
      user.data.facebook +
      "?access_token=" +
      token.access_token +
      "&fields=email,name,birthday,first_name,last_name";
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

function getUserDataForRegister(
  token: string,
  userId: string
): UserData | null {
  var response = httpClientLib.request({
    url:
      "https://graph.facebook.com/" +
      userId +
      "/?fields=email,name&access_token=" +
      token,
    method: "GET",
    contentType: "application/json"
  });
  if (response.body) {
    return JSON.parse(response.body);
  }
  return null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}
