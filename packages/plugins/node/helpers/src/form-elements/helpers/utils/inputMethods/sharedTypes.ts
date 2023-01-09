import { Input } from "../..";
import { z } from "zod";

export type InputWithRequired = Input.TType<
  string,
  z.ZodObject<{ required: z.ZodBoolean }>
>;
