const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const utils = __non_webpack_require__("/lib/util");

const contextLib = __non_webpack_require__("./contextLib");
import * as hashLib from "../helpers/hashLib";

import { getCurrentUser } from "./currUser";

import { ByteSource, Content, MediaImage } from "enonic-types/content";
import { User as KostiUser } from "../../../site/content-types/user/user";
import { ImageScale } from "enonic-types/portal";

export { createUserImageObj, uploadUserImage, getImage };

function createUserImageObj(stream: ByteSource, user: Content<KostiUser>) {
  var image = contentLib.createMedia({
    name: hashLib.generateHash(user.displayName),
    parentPath: user._path,
    data: stream
  });
  user = contentLib.modify({
    key: user._path,
    editor: function (user) {
      user.data.userImage = image._id;
      return user;
    }
  });
  contextLib.runAsAdminAsUser(user, function () {
    contentLib.publish({
      keys: [image._id, user._id],
      sourceBranch: "master",
      targetBranch: "draft",
      includeDependencies: false
    });
  });
  return image;
}

function uploadUserImage() {
  var stream = portal.getMultipartStream("userImage");
  if (!stream) return null;
  var user = getCurrentUser();
  if (!user) return null;
  var image = createUserImageObj(stream, user.content);
  return portal.imageUrl({ id: image._id, scale: "block(140,140)" });
}

function getImage(id: string, size: ImageScale | undefined | null): Image {
  if (!size) {
    size = "max(1366)";
  }
  var image: Content<MediaImage> | null = contentLib.get({ key: id });
  if (image) {
    return {
      url: portal.imageUrl({
        id: id,
        scale: size
      }),
      urlAbsolute: portal.imageUrl({
        id: id,
        scale: size,
        type: "absolute"
      }),
      alt: image.data.altText ? image.data.altText : "",
      caption: image.data.caption ? image.data.caption : "",
      artist: image.data.artist
        ? utils.data.forceArray(image.data.artist)
        : null,
      _id: image._id,
      placeholder: false
    };
  } else {
    return {
      url: portal.assetUrl({
        path: "images/default_avatar.png"
      }),
      urlAbsolute: portal.assetUrl({
        path: "images/default_avatar.png",
        type: "absolute"
      }),
      artist: null,
      alt: "City image",
      caption: "",
      placeholder: true,
      _id: null
    };
  }
}

interface Image {
  url: string;
  urlAbsolute: string;
  artist: string[] | null;
  alt: string;
  caption: string;
  placeholder: boolean;
  _id: string | undefined | null;
}
