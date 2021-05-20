const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

const contextLib = __non_webpack_require__("./contextLib");
import { getCurrentUser } from "../main/currUser";

import { Content } from "enonic-types/content";
import { User as KostiUser } from "../../../site/content-types/user/user";

export { addBookmark, checkIfBookmarked };

function addBookmark(contentId: string) {
  var currUser = getCurrentUser();
  if (!currUser) return null;
  const user = contentLib.modify({
    key: currUser.content._id,
    editor: userEditor
  });
  contextLib.runAsAdminAsUser(currUser, function () {
    return contentLib.publish({
      keys: [user._id],
      sourceBranch: "master",
      targetBranch: "draft",
      includeDependencies: false
    });
  });
  function userEditor(user: Content<KostiUser>) {
    let temp = utils.data.forceArray(user.data.bookmarks);
    if (!temp) {
      temp = [];
    }
    if (temp.indexOf(contentId) == -1) {
      temp.push(contentId);
    } else {
      temp.splice(temp.indexOf(contentId), 1);
    }
    user.data.bookmarks = temp;
    return user;
  }
  return checkIfBookmarked(contentId);
}

function checkIfBookmarked(contentId: string) {
  var user = getCurrentUser();
  if (!user) return false;
  if (
    user &&
    user.content.data &&
    user.content.data.bookmarks &&
    user.content.data.bookmarks.indexOf(contentId) != -1
  ) {
    return true;
  }
  return false;
}
