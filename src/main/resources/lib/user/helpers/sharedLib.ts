import { User } from "enonic-types/auth";
import { Content } from "enonic-types/content";

const nodeLib = __non_webpack_require__("/lib/xp/node");
const portal = __non_webpack_require__("/lib/xp/portal");
const contentLib = __non_webpack_require__("/lib/xp/content");
const repoLib = __non_webpack_require__("/lib/xp/repo");

import * as contextLib from "./contextLib";

export { connectRepo, updateEntity, getSite };

function connectRepo(id: string, branch?: string) {
  if (!branch) {
    branch = "master";
  }
  contextLib.runAsAdmin(function () {
    if (!repoLib.get(id)) {
      createRepo(id);
    }
  });
  return nodeLib.connect({
    repoId: id,
    branch: branch
  });
}

function createRepo(id: string) {
  let repo = repoLib.create({
    id: id
  });
  return repo;
}

function updateEntity(entity: Content, user?: User) {
  if (user) {
    return contextLib.runAsAdminAsUser(user, function () {
      entity = contentLib.modify({
        key: entity._id,
        editor: function editor(c: any) {
          c.data = entity.data;
          return c;
        }
      });
      contentLib.publish({
        keys: [entity._id],
        sourceBranch: "master",
        targetBranch: "draft"
      });
      return entity;
    });
  } else {
    return contextLib.runAsAdmin(function () {
      entity = contentLib.modify({
        key: entity._id,
        editor: function editor(c: any) {
          c.data = entity.data;
          return c;
        }
      });

      contentLib.publish({
        keys: [entity._id],
        sourceBranch: "master",
        targetBranch: "draft"
      });
      return entity;
    });
  }
}

function getSite() {
  var site: any = portal.getSite();
  if (!site) {
    site = contentLib.query({ query: "_path = '/content/kosti'", count: 1 });
    if (site.hits[0]) return site.hits[0];
  }
  return site;
}
