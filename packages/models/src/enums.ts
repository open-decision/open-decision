export const Role = ["USER", "STAFF", "DEVELOPER", "ADMIN"] as const;
export type TRole = typeof Role[number];

export const TokenType = [
  "ACCESS",
  "REFRESH",
  "RESET_PASSSWORD",
  "VERIFY_EMAIL",
] as const;

export type TTokenType = typeof TokenType[number];

export const TreeStatus = ["ACTIVE", "ARCHIVED"] as const;

export type TTreeStatus = typeof TreeStatus[number];
export const WhitelistingType = ["INDIVIDUAL", "DOMAIN"] as const;

export type TWhilistingType = typeof WhitelistingType[number];
