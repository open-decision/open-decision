import { z } from "zod";

export const BaseVariableType = z.object({
  id: z.string().uuid(),
});
