import { z } from "zod";
export declare const type: "compare";
export declare const Type: z.ZodObject<{
    type: z.ZodLiteral<"compare">;
    inputId: z.ZodString;
    valueId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "compare";
    inputId: string;
    valueId: string;
}, {
    type: "compare";
    inputId: string;
    valueId: string;
}>;
export declare type TCompareCondition = z.infer<typeof Type>;
