import { checkRole } from "../utils/roles";

export { checkCurrentUserCityBoss };

function checkCurrentUserCityBoss(role: string): boolean {
  return checkRole(["role:moderator", "role:system.admin", "role:" + role]);
}
