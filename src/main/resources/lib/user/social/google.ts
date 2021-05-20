import { SocialResponse } from "../../types/social";

const httpClientLib = __non_webpack_require__("/lib/http-client");

import { register as reg } from "../main/register";

export { googleRegister };

function googleRegister(token: string) {
  const data = register(token);
  if (data) return reg(data.name, data.email, undefined, true, data.picture);
  return null;
}

function register(token: string): SocialResponse | null {
  let request = httpClientLib.request({
    url: "https://oauth2.googleapis.com/tokeninfo?id_token=" + token,
    method: "GET",
    contentType: "application/json"
  });
  if (!request.body) return null;
  let data: GoogleResponse = JSON.parse(request.body);
  if (data && data.email && data.name) {
    return data;
  }
  return null;
}

interface GoogleResponse {
  name: string;
  email: string;
  picture: string;
}
