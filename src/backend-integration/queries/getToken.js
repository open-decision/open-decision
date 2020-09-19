export const GET_TOKEN = `
mutation {
  tokenAuth(email: "demo@open-decision.org", password: "fogmub-bifDaj-sarjo8") {
    token,
  }
}`;
