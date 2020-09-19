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
