const userRights: string[] = [];
export const adminRights = [
  "getUsers",
  "manageUsers",
  "getWhitelist",
  "manageWhitelist",
];

const allRoles = {
  USER: userRights,
  ADMIN: adminRights,
} as const;

type Roles = keyof typeof allRoles;
export type Permissions = typeof allRoles[keyof typeof allRoles][number];

export const roles = Object.keys(allRoles) as Roles[];
export const roleRights = new Map(Object.entries(allRoles));
