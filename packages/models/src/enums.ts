export const Role = ["USER", "STAFF", "DEVELOPER", "ADMIN"] as const;

export const TokenType = [
  "ACCESS",
  "REFRESH",
  "RESET_PASSSWORD",
  "VERIFY_EMAIL",
] as const;

export const TreeStatus = ["ACTIVE", "ARCHIVED"] as const;

export const WhitelistingType = ["INDIVIDUAL", "DOMAIN"] as const;
