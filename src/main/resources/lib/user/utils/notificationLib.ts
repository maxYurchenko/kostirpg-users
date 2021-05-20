import * as sharedLib from "./../helpers/sharedLib";

exports.getNotificationsForUser = getNotificationsForUser;

function getNotificationsForUser(id: string) {
  const query = "forUser = '" + id + "' and seen = 0";
  const notificationsRepo = sharedLib.connectRepo("notifications");
  const temp = notificationsRepo.query({
    query: query,
    sort: "seen ASC, createdDate DESC"
  });
  return temp.total;
}
