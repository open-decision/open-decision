import { z } from "zod";
export const Answer = z.object({ id: z.string().uuid(), text: z.string() });

export const Type = z.object({
  id: z.string().uuid(),
  type: z.enum(["select"]),
  answers: z.array(Answer),
});

export const Record = z.record(Type);

export type TInput = z.infer<typeof Type>;
export type TInputsRecord = z.infer<typeof Record>;
export type TAnswer = z.infer<typeof Answer>;
