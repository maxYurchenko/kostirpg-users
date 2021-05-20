export interface SocialResponse {
  name: string;
  email: string;
  picture?: string;
  otherData?: SocialMedia;
}
export interface SocialMedia {
  facebook?: string;
  discord?: string;
  vk?: string;
}
