import { z } from "zod";

export const deleteUserInput = z.void();

export type TDeleteUserInput = z.infer<typeof deleteUserInput>;
