import { z } from "zod";

export const type = "select" as const;
export const Answer = z.object({ id: z.string().uuid(), text: z.string() });

const Shared = z.object({ id: z.string().uuid() });

export const Type = Shared.extend({
  type: z.literal("select"),
  answers: z.array(Answer),
});

export type TAnswer = z.infer<typeof Answer>;
export type TSelectInput = z.infer<typeof Type>;
