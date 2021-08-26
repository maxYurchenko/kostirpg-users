import { Content } from "enonic-types/content";
import { User } from "../../../site/content-types/user/user";

const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

export { findUserContentType };

function findUserContentType(email: string): Content<User> | null {
  let query = contentLib.query<User>({
    query: "data.email = '" + email + "'",
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (query.total > 0) {
    return query.hits[0];
  }
  return null;
}
