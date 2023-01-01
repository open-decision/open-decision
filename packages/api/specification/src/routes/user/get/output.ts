import { z } from "zod";
import { UserModel } from "@open-decision/models";

export const getUserOutput = UserModel.omit({ password: true });

export type TGetUserOutput = z.infer<typeof getUserOutput>;
