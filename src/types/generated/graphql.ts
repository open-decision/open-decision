import { GraphQLClient } from 'graphql-request';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   *
   *     Errors messages and codes mapped to
   *     fields or non fields errors.
   *     Example:
   *     {
   *         field_name: [
   *             {
   *                 "message": "error message",
   *                 "code": "error_code"
   *             }
   *         ],
   *         other_field: [
   *             {
   *                 "message": "error message",
   *                 "code": "error_code"
   *             }
   *         ],
   *         nonFieldErrors: [
   *             {
   *                 "message": "error message",
   *                 "code": "error_code"
   *             }
   *         ]
   *     }
   *
   */
  ExpectedErrorType: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
};

/**
 * Archive account and revoke refresh tokens.
 *
 * User must be verified and confirm password.
 */
export type ArchiveAccount = {
  __typename?: 'ArchiveAccount';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type CreateDecisionTreeMutationInput = {
  name: Scalars['String'];
  tags?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDecisionTreeMutationPayload = {
  __typename?: 'CreateDecisionTreeMutationPayload';
  tree?: Maybe<DecisionTreeNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};


export type DecisionTreeNode = Node & {
  __typename?: 'DecisionTreeNode';
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  tags?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
  nodeSet: NodeNodeConnection;
  /** The ID of the object. */
  id: Scalars['ID'];
};


export type DecisionTreeNodeNodeSetArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  name_Icontains?: Maybe<Scalars['String']>;
  name_Istartswith?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  slug_Icontains?: Maybe<Scalars['String']>;
  slug_Istartswith?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
  question_Icontains?: Maybe<Scalars['String']>;
  question_Istartswith?: Maybe<Scalars['String']>;
  inputs?: Maybe<Scalars['String']>;
  inputs_Icontains?: Maybe<Scalars['String']>;
  inputs_Istartswith?: Maybe<Scalars['String']>;
  decisionTree?: Maybe<Scalars['ID']>;
  startNode?: Maybe<Scalars['Boolean']>;
  newNode?: Maybe<Scalars['Boolean']>;
  endNode?: Maybe<Scalars['Boolean']>;
};

export type DecisionTreeNodeConnection = {
  __typename?: 'DecisionTreeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DecisionTreeNodeEdge>>;
};

/** A Relay edge containing a `DecisionTreeNode` and its cursor. */
export type DecisionTreeNodeEdge = {
  __typename?: 'DecisionTreeNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<DecisionTreeNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/**
 * Delete account permanently or make `user.is_active=False`.
 *
 * The behavior is defined on settings.
 * Anyway user refresh tokens are revoked.
 *
 * User must be verified and confirm password.
 */
export type DeleteAccount = {
  __typename?: 'DeleteAccount';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};



export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Register user with fields defined in the settings.
   *
   * If the email field of the user model is part of the
   * registration fields (default), check if there is
   * no user with that email or as a secondary email.
   *
   * If it exists, it does not register the user,
   * even if the email field is not defined as unique
   * (default of the default django user model).
   *
   * When creating the user, it also creates a `UserStatus`
   * related to that user, making it possible to track
   * if the user is archived, verified and has a secondary
   * email.
   *
   * Send account verification email.
   *
   * If allowed to not verified users login, return token.
   */
  register?: Maybe<Register>;
  /**
   * Verify user account.
   *
   * Receive the token that was sent by email.
   * If the token is valid, make the user verified
   * by making the `user.status.verified` field true.
   */
  verifyAccount?: Maybe<VerifyAccount>;
  /**
   * Sends activation email.
   *
   * It is called resend because theoretically
   * the first activation email was sent when
   * the user registered.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  resendActivationEmail?: Maybe<ResendActivationEmail>;
  /**
   * Send password reset email.
   *
   * For non verified users, send an activation
   * email instead.
   *
   * Accepts both primary and secondary email.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  sendPasswordResetEmail?: Maybe<SendPasswordResetEmail>;
  /**
   * Change user password without old password.
   *
   * Receive the token that was sent by email.
   *
   * If token and new passwords are valid, update
   * user password and in case of using refresh
   * tokens, revoke all of them.
   *
   * Also, if user has not been verified yet, verify it.
   */
  passwordReset?: Maybe<PasswordReset>;
  /**
   * Change account password when user knows the old password.
   *
   * A new token and refresh token are sent. User must be verified.
   */
  passwordChange?: Maybe<PasswordChange>;
  /**
   * Update user model fields, defined on settings.
   *
   * User must be verified.
   */
  updateAccount?: Maybe<UpdateAccount>;
  /**
   * Archive account and revoke refresh tokens.
   *
   * User must be verified and confirm password.
   */
  archiveAccount?: Maybe<ArchiveAccount>;
  /**
   * Delete account permanently or make `user.is_active=False`.
   *
   * The behavior is defined on settings.
   * Anyway user refresh tokens are revoked.
   *
   * User must be verified and confirm password.
   */
  deleteAccount?: Maybe<DeleteAccount>;
  /**
   * Send activation to secondary email.
   *
   * User must be verified and confirm password.
   */
  sendSecondaryEmailActivation?: Maybe<SendSecondaryEmailActivation>;
  /**
   * Verify user secondary email.
   *
   * Receive the token that was sent by email.
   * User is already verified when using this mutation.
   *
   * If the token is valid, add the secondary email
   * to `user.status.secondary_email` field.
   *
   * Note that until the secondary email is verified,
   * it has not been saved anywhere beyond the token,
   * so it can still be used to create a new account.
   * After being verified, it will no longer be available.
   */
  verifySecondaryEmail?: Maybe<VerifySecondaryEmail>;
  /**
   * Swap between primary and secondary emails.
   *
   * Require password confirmation.
   */
  swapEmails?: Maybe<SwapEmails>;
  /**
   * Remove user secondary email.
   *
   * Require password confirmation.
   */
  removeSecondaryEmail?: Maybe<RemoveSecondaryEmail>;
  /**
   * Obtain JSON web token for given user.
   *
   * Allow to perform login with different fields,
   * and secondary email if set. The fields are
   * defined on settings.
   *
   * Not verified users can login by default. This
   * can be changes on settings.
   *
   * If user is archived, make it unarchive and
   * return `unarchiving=True` on output.
   */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  verifyToken?: Maybe<VerifyToken>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  refreshToken?: Maybe<RefreshToken>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  revokeToken?: Maybe<RevokeToken>;
  updateTree?: Maybe<UpdateDecisionTreeMutationPayload>;
  createTree?: Maybe<CreateDecisionTreeMutationPayload>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  username: Scalars['String'];
  password1: Scalars['String'];
  password2: Scalars['String'];
};


export type MutationVerifyAccountArgs = {
  token: Scalars['String'];
};


export type MutationResendActivationEmailArgs = {
  email: Scalars['String'];
};


export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String'];
};


export type MutationPasswordResetArgs = {
  token: Scalars['String'];
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
};


export type MutationPasswordChangeArgs = {
  oldPassword: Scalars['String'];
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
};


export type MutationUpdateAccountArgs = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};


export type MutationArchiveAccountArgs = {
  password: Scalars['String'];
};


export type MutationDeleteAccountArgs = {
  password: Scalars['String'];
};


export type MutationSendSecondaryEmailActivationArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifySecondaryEmailArgs = {
  token: Scalars['String'];
};


export type MutationSwapEmailsArgs = {
  password: Scalars['String'];
};


export type MutationRemoveSecondaryEmailArgs = {
  password: Scalars['String'];
};


export type MutationTokenAuthArgs = {
  password: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};


export type MutationVerifyTokenArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationRefreshTokenArgs = {
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationRevokeTokenArgs = {
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationUpdateTreeArgs = {
  input: UpdateDecisionTreeMutationInput;
};


export type MutationCreateTreeArgs = {
  input: CreateDecisionTreeMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type NodeNode = Node & {
  __typename?: 'NodeNode';
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  decisionTree: DecisionTreeNode;
  path?: Maybe<Scalars['String']>;
  question: Scalars['String'];
  inputs?: Maybe<Scalars['String']>;
  newNode: Scalars['Boolean'];
  startNode: Scalars['Boolean'];
  endNode: Scalars['Boolean'];
  extraData?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type NodeNodeConnection = {
  __typename?: 'NodeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<NodeNodeEdge>>;
};

/** A Relay edge containing a `NodeNode` and its cursor. */
export type NodeNodeEdge = {
  __typename?: 'NodeNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<NodeNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/**
 * Obtain JSON web token for given user.
 *
 * Allow to perform login with different fields,
 * and secondary email if set. The fields are
 * defined on settings.
 *
 * Not verified users can login by default. This
 * can be changes on settings.
 *
 * If user is archived, make it unarchive and
 * return `unarchiving=True` on output.
 */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
  user?: Maybe<UserNode>;
  unarchiving?: Maybe<Scalars['Boolean']>;
  token: Scalars['String'];
  refreshToken: Scalars['String'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/**
 * Change account password when user knows the old password.
 *
 * A new token and refresh token are sent. User must be verified.
 */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
  refreshToken?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/**
 * Change user password without old password.
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, update
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordReset = {
  __typename?: 'PasswordReset';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<UserNode>;
  /** The ID of the object */
  decisionTree?: Maybe<DecisionTreeNode>;
  allDecisionTrees?: Maybe<DecisionTreeNodeConnection>;
  /** The ID of the object */
  node?: Maybe<NodeNode>;
  allNodes?: Maybe<NodeNodeConnection>;
};


export type QueryDecisionTreeArgs = {
  id: Scalars['ID'];
};


export type QueryAllDecisionTreesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryAllNodesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  name_Icontains?: Maybe<Scalars['String']>;
  name_Istartswith?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  slug_Icontains?: Maybe<Scalars['String']>;
  slug_Istartswith?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
  question_Icontains?: Maybe<Scalars['String']>;
  question_Istartswith?: Maybe<Scalars['String']>;
  inputs?: Maybe<Scalars['String']>;
  inputs_Icontains?: Maybe<Scalars['String']>;
  inputs_Istartswith?: Maybe<Scalars['String']>;
  decisionTree?: Maybe<Scalars['ID']>;
  startNode?: Maybe<Scalars['Boolean']>;
  newNode?: Maybe<Scalars['Boolean']>;
  endNode?: Maybe<Scalars['Boolean']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
  token: Scalars['String'];
  refreshToken: Scalars['String'];
};

/**
 * Register user with fields defined in the settings.
 *
 * If the email field of the user model is part of the
 * registration fields (default), check if there is
 * no user with that email or as a secondary email.
 *
 * If it exists, it does not register the user,
 * even if the email field is not defined as unique
 * (default of the default django user model).
 *
 * When creating the user, it also creates a `UserStatus`
 * related to that user, making it possible to track
 * if the user is archived, verified and has a secondary
 * email.
 *
 * Send account verification email.
 *
 * If allowed to not verified users login, return token.
 */
export type Register = {
  __typename?: 'Register';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
  refreshToken?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/**
 * Remove user secondary email.
 *
 * Require password confirmation.
 */
export type RemoveSecondaryEmail = {
  __typename?: 'RemoveSecondaryEmail';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Sends activation email.
 *
 * It is called resend because theoretically
 * the first activation email was sent when
 * the user registered.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type ResendActivationEmail = {
  __typename?: 'ResendActivationEmail';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RevokeToken = {
  __typename?: 'RevokeToken';
  revoked: Scalars['Int'];
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Send password reset email.
 *
 * For non verified users, send an activation
 * email instead.
 *
 * Accepts both primary and secondary email.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type SendPasswordResetEmail = {
  __typename?: 'SendPasswordResetEmail';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Send activation to secondary email.
 *
 * User must be verified and confirm password.
 */
export type SendSecondaryEmailActivation = {
  __typename?: 'SendSecondaryEmailActivation';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Swap between primary and secondary emails.
 *
 * Require password confirmation.
 */
export type SwapEmails = {
  __typename?: 'SwapEmails';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Update user model fields, defined on settings.
 *
 * User must be verified.
 */
export type UpdateAccount = {
  __typename?: 'UpdateAccount';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type UpdateDecisionTreeMutationInput = {
  name: Scalars['String'];
  tags?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDecisionTreeMutationPayload = {
  __typename?: 'UpdateDecisionTreeMutationPayload';
  tree?: Maybe<DecisionTreeNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UserNode = Node & {
  __typename?: 'UserNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean'];
  dateJoined: Scalars['DateTime'];
  username: Scalars['String'];
  email: Scalars['String'];
  decisiontreeSet: DecisionTreeNodeConnection;
  pk?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  verified?: Maybe<Scalars['Boolean']>;
  secondaryEmail?: Maybe<Scalars['String']>;
};


export type UserNodeDecisiontreeSetArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
};

/**
 * Verify user account.
 *
 * Receive the token that was sent by email.
 * If the token is valid, make the user verified
 * by making the `user.status.verified` field true.
 */
export type VerifyAccount = {
  __typename?: 'VerifyAccount';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/**
 * Verify user secondary email.
 *
 * Receive the token that was sent by email.
 * User is already verified when using this mutation.
 *
 * If the token is valid, add the secondary email
 * to `user.status.secondary_email` field.
 *
 * Note that until the secondary email is verified,
 * it has not been saved anywhere beyond the token,
 * so it can still be used to create a new account.
 * After being verified, it will no longer be available.
 */
export type VerifySecondaryEmail = {
  __typename?: 'VerifySecondaryEmail';
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type VerifyToken = {
  __typename?: 'VerifyToken';
  payload: Scalars['GenericScalar'];
  success?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type Login_UserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type Login_UserMutation = (
  { __typename?: 'Mutation' }
  & { tokenAuth?: Maybe<(
    { __typename?: 'ObtainJSONWebToken' }
    & Pick<ObtainJsonWebToken, 'errors'>
  )> }
);

export type Logout_UserMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type Logout_UserMutation = (
  { __typename?: 'Mutation' }
  & { revokeToken?: Maybe<(
    { __typename?: 'RevokeToken' }
    & Pick<RevokeToken, 'errors'>
  )> }
);

export type Register_UserMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password1: Scalars['String'];
  password2: Scalars['String'];
}>;


export type Register_UserMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'Register' }
    & Pick<Register, 'errors'>
  )> }
);

export type Refresh_TokenMutationVariables = Exact<{ [key: string]: never; }>;


export type Refresh_TokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshToken?: Maybe<(
    { __typename?: 'RefreshToken' }
    & Pick<RefreshToken, 'token' | 'refreshExpiresIn' | 'refreshToken'>
  )> }
);

export type Create_TreeMutationVariables = Exact<{
  input: CreateDecisionTreeMutationInput;
}>;


export type Create_TreeMutation = (
  { __typename?: 'Mutation' }
  & { createTree?: Maybe<(
    { __typename?: 'CreateDecisionTreeMutationPayload' }
    & { tree?: Maybe<(
      { __typename?: 'DecisionTreeNode' }
      & Pick<DecisionTreeNode, 'id' | 'name' | 'extraData' | 'tags'>
    )> }
  )> }
);

export type Update_TreeMutationVariables = Exact<{
  input: UpdateDecisionTreeMutationInput;
}>;


export type Update_TreeMutation = (
  { __typename?: 'Mutation' }
  & { updateTree?: Maybe<(
    { __typename?: 'UpdateDecisionTreeMutationPayload' }
    & { tree?: Maybe<(
      { __typename?: 'DecisionTreeNode' }
      & Pick<DecisionTreeNode, 'id' | 'name' | 'extraData' | 'tags'>
    )> }
  )> }
);

export type All_TreesQueryVariables = Exact<{ [key: string]: never; }>;


export type All_TreesQuery = (
  { __typename?: 'Query' }
  & { allDecisionTrees?: Maybe<(
    { __typename?: 'DecisionTreeNodeConnection' }
    & { edges: Array<Maybe<(
      { __typename?: 'DecisionTreeNodeEdge' }
      & { node?: Maybe<(
        { __typename?: 'DecisionTreeNode' }
        & Pick<DecisionTreeNode, 'id' | 'name' | 'tags' | 'createdAt'>
      )> }
    )>> }
  )> }
);

export type TreeQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TreeQuery = (
  { __typename?: 'Query' }
  & { decisionTree?: Maybe<(
    { __typename?: 'DecisionTreeNode' }
    & Pick<DecisionTreeNode, 'name' | 'extraData'>
  )> }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'UserNode' }
    & Pick<UserNode, 'email' | 'firstName' | 'username'>
  )> }
);


export const Login_UserDocument = `
    mutation LOGIN_USER($email: String!, $password: String!) {
  tokenAuth(email: $email, password: $password) {
    errors
  }
}
    `;
export const useLogin_UserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Login_UserMutation, TError, Login_UserMutationVariables, TContext>
    ) => 
    useMutation<Login_UserMutation, TError, Login_UserMutationVariables, TContext>(
      (variables?: Login_UserMutationVariables) => fetcher<Login_UserMutation, Login_UserMutationVariables>(client, Login_UserDocument, variables)(),
      options
    );
export const Logout_UserDocument = `
    mutation LOGOUT_USER($refreshToken: String!) {
  revokeToken(refreshToken: $refreshToken) {
    errors
  }
}
    `;
export const useLogout_UserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Logout_UserMutation, TError, Logout_UserMutationVariables, TContext>
    ) => 
    useMutation<Logout_UserMutation, TError, Logout_UserMutationVariables, TContext>(
      (variables?: Logout_UserMutationVariables) => fetcher<Logout_UserMutation, Logout_UserMutationVariables>(client, Logout_UserDocument, variables)(),
      options
    );
export const Register_UserDocument = `
    mutation REGISTER_USER($email: String!, $username: String!, $password1: String!, $password2: String!) {
  register(
    email: $email
    username: $username
    password1: $password1
    password2: $password2
  ) {
    errors
  }
}
    `;
export const useRegister_UserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Register_UserMutation, TError, Register_UserMutationVariables, TContext>
    ) => 
    useMutation<Register_UserMutation, TError, Register_UserMutationVariables, TContext>(
      (variables?: Register_UserMutationVariables) => fetcher<Register_UserMutation, Register_UserMutationVariables>(client, Register_UserDocument, variables)(),
      options
    );
export const Refresh_TokenDocument = `
    mutation REFRESH_TOKEN {
  refreshToken {
    token
    refreshExpiresIn
    refreshToken
  }
}
    `;
export const useRefresh_TokenMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Refresh_TokenMutation, TError, Refresh_TokenMutationVariables, TContext>
    ) => 
    useMutation<Refresh_TokenMutation, TError, Refresh_TokenMutationVariables, TContext>(
      (variables?: Refresh_TokenMutationVariables) => fetcher<Refresh_TokenMutation, Refresh_TokenMutationVariables>(client, Refresh_TokenDocument, variables)(),
      options
    );
export const Create_TreeDocument = `
    mutation CREATE_TREE($input: CreateDecisionTreeMutationInput!) {
  createTree(input: $input) {
    tree {
      id
      name
      extraData
      tags
    }
  }
}
    `;
export const useCreate_TreeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Create_TreeMutation, TError, Create_TreeMutationVariables, TContext>
    ) => 
    useMutation<Create_TreeMutation, TError, Create_TreeMutationVariables, TContext>(
      (variables?: Create_TreeMutationVariables) => fetcher<Create_TreeMutation, Create_TreeMutationVariables>(client, Create_TreeDocument, variables)(),
      options
    );
export const Update_TreeDocument = `
    mutation UPDATE_TREE($input: UpdateDecisionTreeMutationInput!) {
  updateTree(input: $input) {
    tree {
      id
      name
      extraData
      tags
    }
  }
}
    `;
export const useUpdate_TreeMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<Update_TreeMutation, TError, Update_TreeMutationVariables, TContext>
    ) => 
    useMutation<Update_TreeMutation, TError, Update_TreeMutationVariables, TContext>(
      (variables?: Update_TreeMutationVariables) => fetcher<Update_TreeMutation, Update_TreeMutationVariables>(client, Update_TreeDocument, variables)(),
      options
    );
export const All_TreesDocument = `
    query ALL_TREES {
  allDecisionTrees {
    edges {
      node {
        id
        name
        tags
        createdAt
      }
    }
  }
}
    `;
export const useAll_TreesQuery = <
      TData = All_TreesQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables?: All_TreesQueryVariables, 
      options?: UseQueryOptions<All_TreesQuery, TError, TData>
    ) => 
    useQuery<All_TreesQuery, TError, TData>(
      ['ALL_TREES', variables],
      fetcher<All_TreesQuery, All_TreesQueryVariables>(client, All_TreesDocument, variables),
      options
    );
export const TreeDocument = `
    query TREE($id: ID!) {
  decisionTree(id: $id) {
    name
    extraData
  }
}
    `;
export const useTreeQuery = <
      TData = TreeQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables: TreeQueryVariables, 
      options?: UseQueryOptions<TreeQuery, TError, TData>
    ) => 
    useQuery<TreeQuery, TError, TData>(
      ['TREE', variables],
      fetcher<TreeQuery, TreeQueryVariables>(client, TreeDocument, variables),
      options
    );
export const UserDocument = `
    query USER {
  me {
    email
    firstName
    username
  }
}
    `;
export const useUserQuery = <
      TData = UserQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables?: UserQueryVariables, 
      options?: UseQueryOptions<UserQuery, TError, TData>
    ) => 
    useQuery<UserQuery, TError, TData>(
      ['USER', variables],
      fetcher<UserQuery, UserQueryVariables>(client, UserDocument, variables),
      options
    );