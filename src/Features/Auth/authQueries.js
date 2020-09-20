export const GET_TOKEN = `
mutation ($email: String!, $password: String!) {
  tokenAuth(email: $email, password: $password){
    success,
    errors,
    token,
    refreshToken,
    unarchiving,
    user {
      email
      lastName
      firstName
    }
  }
}`;

export const GET_USER_INFO = `
query {
  me {
    email
    lastName
    firstName
    id
    dateJoined
    lastLogin
    isStaff
    isActive
  }
}`;

export const LOGOUT_USER = `
mutation ($refreshToken: String!) {
  revokeToken(refreshToken: $refreshToken) {
    success,
    errors
  }
}`;

export const REGISTER_USER = `
mutation ($email: String!, $username: String!, $password1: String!, $password2: String!) {
  register(
    email: $email,
    username: $username,
    password1: $password1,
    password2: $password2,
  ) {
    success,
    errors,
    token,
  }
}`;
