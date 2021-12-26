import express from "express";
import validate from "../../middlewares/validate";
import { authValidation } from "../../validations/";
import { authController } from "../../controllers/";
import { auth } from "../../middlewares/auth";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
authRouter.post("/login", validate(authValidation.login), authController.login);
authRouter.post(
  "/logout",
  validate(authValidation.logout),
  authController.logout
);
authRouter.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
authRouter.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
authRouter.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
authRouter.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
authRouter.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

export default authRouter;
/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 300
 *                 description: Must be sufficiently complex (score at zxcvbn-ts >= 3)
 *             example:
 *               email: fake@example.com
 *               password: Th@t!shardToGuess
 *     responses:
 *       "201":
 *         description: Created
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshCookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg; Path=/; Secure; HttpOnly; SameSite=None; Domain=example.com
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 access:
 *                   $ref: '#/components/schemas/Token'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: Th@t!shardToGuess
 *     responses:
 *       "200":
 *         description: OK
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshCookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg; Path=/; Secure; HttpOnly; SameSite=None; Domain=example.com
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 access:
 *                   $ref: '#/components/schemas/Token'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshCookie
 *         schema:
 *           type: string
 *           example: refreshCookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg; Path=/; Secure; HttpOnly; SameSite=None; Domain=example.com
 *         required: true
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth token if refresh token is still valid or auth & refresh token if login is still valid
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshCookie
 *         schema:
 *           type: string
 *           example: refreshCookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg; Path=/; Secure; HttpOnly; SameSite=None; Domain=example.com
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessToken'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 300
 *                 description: Must be sufficiently complex (score at zxcvbn-ts >= 3)
 *             example:
 *               password: Th@t!shardToGuess
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @openapi
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
