import { z } from "zod";
export declare const type: "select";
export declare const Answer: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    text: string;
}, {
    id: string;
    text: string;
}>;
export declare const Type: z.ZodObject<{
    answers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        text: string;
    }, {
        id: string;
        text: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    answers: {
        id: string;
        text: string;
    }[];
}, {
    answers: {
        id: string;
        text: string;
    }[];
}>;
export declare type TAnswer = z.infer<typeof Answer>;
