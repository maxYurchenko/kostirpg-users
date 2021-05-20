import { User } from "enonic-types/auth";
import { Content } from "enonic-types/content";
import { User as KostiUser } from "../../site/content-types/user/user";

export interface UserAllData {
  content: Content<KostiUser>;
  user: User;
  data?: object | null;
}
