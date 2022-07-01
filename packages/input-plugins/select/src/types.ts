import { z } from "zod";

export const type = "select" as const;
export const Answer = z.object({ id: z.string().uuid(), text: z.string() });

export const Type = z.object({
  answers: z.array(Answer),
});

export type TAnswer = z.infer<typeof Answer>;
