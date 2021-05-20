const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const utils = __non_webpack_require__("/lib/util");

import * as contextLib from "./../helpers/contextLib";
import * as hashLib from "../helpers/hashLib";

import { getCurrentUser } from "./currUser";

import { ByteSource, Content, MediaImage } from "enonic-types/content";
import { User as KostiUser } from "../../../site/content-types/user/user";
import { ImageScale } from "enonic-types/portal";
import { UserAllData } from "../../types/user";

export { createUserImageObj, uploadUserImage, getImage };

function createUserImageObj(stream: ByteSource, user: UserAllData) {
  var image = contentLib.createMedia({
    name: hashLib.generateHash(user.content.displayName),
    parentPath: user.content._path,
    data: stream
  });
  contentLib.modify({
    key: user.content._path,
    editor: function (c: Content<KostiUser>) {
      c.data.userImage = image._id;
      return c;
    }
  });
  contextLib.runAsAdminAsUser(user.user, function () {
    contentLib.publish({
      keys: [image._id, user.content._id],
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
  var image = createUserImageObj(stream, user);
  return portal.imageUrl({ id: image._id, scale: "block(140,140)" });
}

function getImage(id?: string, size?: ImageScale | null): Image {
  if (!size) {
    size = "max(1366)";
  }
  if (!id) {
    return getPlaceholder();
  }
  var image: Content<MediaImage> | null = contentLib.get({ key: id });
  if (!image) {
    return getPlaceholder();
  }
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
    artist: image.data.artist ? utils.data.forceArray(image.data.artist) : null,
    _id: image._id,
    placeholder: false
  };
}

function getPlaceholder() {
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

interface Image {
  url: string;
  urlAbsolute: string;
  artist: string[] | null;
  alt: string;
  caption: string;
  placeholder: boolean;
  _id: string | undefined | null;
}
