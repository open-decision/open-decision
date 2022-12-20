import { z } from "zod";

export const BaseVariableType = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  data: z.unknown(),
});

export * from "./VariablePlugin";
