import { APIErrors } from "@open-decision/type-classes";
import { z } from "zod";
import { authOuput } from "../shared";

export const registerOutput = authOuput;

export type TRegisterOutput = z.infer<typeof registerOutput>;

export type TRegisterError = {
  email: APIErrors.EMAIL_ALREADY_USED | APIErrors.EMAIL_NOT_WHITELISTED;
  password: APIErrors.PASSWORD_TO_WEAK;
};
