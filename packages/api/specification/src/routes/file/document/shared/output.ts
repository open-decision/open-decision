import { z } from "zod";

export const getDocumentSingleOutput = z.any();

export type TGetDocumentSingleOutput = z.infer<typeof getDocumentSingleOutput>;
