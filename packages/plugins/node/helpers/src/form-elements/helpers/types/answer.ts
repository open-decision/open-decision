import { z } from "zod";

export const Answer = z.object({ id: z.string().uuid(), value: z.string() });

export type TAnswer = z.infer<typeof Answer>;
