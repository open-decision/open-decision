import express from "express";
import { auth } from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import { userValidation } from "../../validations";
import { userController } from "../../controllers";
const userRouter = express.Router();

userRouter
  .route("/")
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  );
// .get(
//   auth("getUsers"),
//   validate(userValidation.getUsers),
//   userController.getUsers
// );

userRouter
  .route("/whitelist")
  // .get(auth("getWhitelist"), userController.getWhitelist)
  .get(auth("getWhitelist"), userController.getWhitelist)
  .post(
    auth("manageWhitelist"),
    validate(userValidation.whitelistUsersForRegistration),
    userController.addToWhitelist
  )
  .delete(
    auth("manageWhitelist"),
    validate(userValidation.removeUsersFromWhitelist),
    userController.removeFromWhitelist
  );

userRouter
  .route("/:userUuid")
  .get(
    auth("getUsers"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth("manageUsers"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default userRouter;
/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
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
 *               role:
 *                  type: string
 *                  enum: [USER, ADMIN]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: Th@t!shardToGuess
 *               role: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /users/{uuid}:
 *   get:
 *     summary: Get a user
 *     description: Logged in users can fetch only their own user information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: User uuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a user
 *     description: Logged in users can only update their own information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: User uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
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
 *               name: fake name
 *               email: fake@example.com
 *               password: Th@t!shardToGuess
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: User uuid
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @openapi
 * tags:
 *   name: Whitelist
 *   description: Management and retrieval for user whitelist
 */
/**
 * @openapi
 * /whitelist:
 *   get:
 *     summary: Get all whitelist entries
 *     description: Only admins can get whitelist entries
 *     tags: [Whitelist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/WhitelistEntryArray'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   post:
 *     summary: Create many whitelist entries
 *     description: Only admins can add mail addresses to the whitelist
 *     tags: [Whitelist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emails
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                   uniqueItems: true
 *               sendInvite:
 *                 type: boolean
 *                 description: False by default, currently sending invites is not yet implemented
 *             example:
 *               emails: ["fake@example.com", "fake2@example.com"]
 *               sendInvite: false
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   delete:
 *     summary: Delete whitelist entires by email
 *     description: Only admins can delete whitelist entries
 *     tags: [Whitelist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emails
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *             example:
 *               emails: ["fake@example.com", "fake2@example.com"]
 *     responses:
 *       "201":
 *         description: Sucessfully deleted
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
