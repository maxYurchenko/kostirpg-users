const authLib = __non_webpack_require__("/lib/xp/auth");

export { logout };

function logout() {
  return authLib.logout();
}
