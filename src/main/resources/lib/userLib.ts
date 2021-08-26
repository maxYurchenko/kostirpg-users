import { getDiscordData, discordRegister } from "./user/social/discord";
import { getVkData, vkRegister } from "./user/social/vk";
import { getFacebookData, fbRegister } from "./user/social/facebook";
import { googleRegister } from "./user/social/google";

import { checkRole, addRole } from "./user/utils/roles";
import { createUserContentType } from "./user/utils/createContentType";
import { findUserContentType } from "./user/utils/findUserContentType";
import { uploadUserImage } from "./user/main/image";
import { editUser } from "./user/main/edit";
import { logout } from "./user/main/logout";
import { findUser } from "./user/utils/helpers";
import { getCurrentUser } from "./user/main/currUser";
import { login } from "./user/main/login";
import { register } from "./user/main/register";
import { addBookmark, checkIfBookmarked } from "./user/utils/bookmarks";
import { resetPass, forgotPass, setNewPass } from "./user/utils/password";
import {
  getSystemUser,
  getUserDataById,
  activateUser
} from "./user/utils/misc";

//Main
exports.login = login;
exports.editUser = editUser;
exports.register = register;
exports.getCurrentUser = getCurrentUser;
exports.logout = logout;
exports.uploadUserImage = uploadUserImage;

//Social data
exports.getDiscordData = getDiscordData;
exports.getVkData = getVkData;
exports.getFacebookData = getFacebookData;

//Social reg
exports.discordRegister = discordRegister;
exports.fbRegister = fbRegister;
exports.vkRegister = vkRegister;
exports.jwtRegister = googleRegister;

//Roles
exports.checkRole = checkRole;
exports.addRole = addRole;

//Other
exports.findUser = findUser;
exports.activateUser = activateUser;
exports.addBookmark = addBookmark;
exports.checkIfBookmarked = checkIfBookmarked;
exports.getUserDataById = getUserDataById;
exports.getSystemUser = getSystemUser;
exports.createUserContentType = createUserContentType;
exports.findUserContentType = findUserContentType;

//Password
exports.setNewPass = setNewPass;
exports.resetPass = resetPass;
exports.forgotPass = forgotPass;
