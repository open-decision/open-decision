import { z } from "zod";

const Type = z.object({ id: z.string().uuid(), type: z.string().optional() });

export const Record = z.record(Type);

export type TInput = z.infer<typeof Type>;
export type TInputsRecord = z.infer<typeof Record>;
