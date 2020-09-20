export const GET_TOKEN = `
mutation ($email: String!, $password: String!) {
  tokenAuth(email: $email, password: $password) {
    token,
  }
}`;
