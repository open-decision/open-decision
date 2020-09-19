export const REGISTER_USER = `
mutation {
    register(
      email: "new_user@email.com",
      username: "new_user",
      password1: "123456super",
      password2: "123456super",
    ) {
      success,
      errors,
      token,
    }
  }`;
