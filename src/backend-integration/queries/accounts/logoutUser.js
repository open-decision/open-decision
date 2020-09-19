export const LOGOUT_USER = `
mutation {
    revokeToken(
      refreshToken: "a64f732b4e00432f2ff1b47537a11458be13fc82"
    ) {
      success,
      errors
    }
  }`;
