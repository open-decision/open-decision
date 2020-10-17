import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation LOGIN_USER($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      unarchiving
      user {
        email
        lastName
        firstName
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LOGOUT_USER($refreshToken: String!) {
    revokeToken(refreshToken: $refreshToken) {
      success
      errors
    }
  }
`;

export const REGISTER_USER = gql`
  mutation REGISTER_USER(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
    }
  }
`;
