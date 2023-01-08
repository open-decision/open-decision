import { Answer, Input } from "../..";
import { z } from "zod";

export type InputWithAnswers = Input.TType<
  string,
  z.ZodObject<{ answers: z.ZodArray<typeof Answer> }>
>;
