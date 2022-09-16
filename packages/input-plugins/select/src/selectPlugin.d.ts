import { TAnswer, Type } from "./types";
import { InputPlugin, TBaseTreeClient } from "@open-decision/type-classes";
import { z } from "zod";
import { ComparePlugin } from "@open-decision/compare-condition-plugin";
export declare type TSelectInput = z.infer<SelectPlugin["MergedType"]>;
export declare class SelectPlugin extends InputPlugin<typeof Type, "select"> {
    comparePlugin: ComparePlugin;
    constructor(treeClient: TBaseTreeClient);
    create(data: Partial<Omit<z.infer<typeof this.SpecificType>, "type">>): z.infer<typeof this.MergedType>;
    createAnswer(answer: Pick<TAnswer, "text">): {
        text: string;
        id: string;
    };
    getAnswer(input: z.infer<typeof this.MergedType>, answerId: string): {
        id: string;
        text: string;
    } | undefined;
    addAnswer(inputId: string, answer: TAnswer): void;
    updateAnswer(inputId: string, answerId: string, newValue: string): void;
    reorderAnswers: (input: TSelectInput) => (newAnswers: TAnswer[]) => void;
    deleteAnswer(inputId: string, answerId: string): void;
    updateTarget({ nodeId, inputId, answerId, newItem, edgeId, }: {
        nodeId: string;
        inputId: string;
        answerId: string;
        newItem: string;
        edgeId?: string;
    }): void;
    createTargetNode(nodeId: string, inputId: string, valueId: string, data: {
        name: string;
    }): Error | {
        id: string;
        label: string | undefined;
    };
    getInputsWithAnswers(inputs: TSelectInput[]): Record<string, TSelectInput> | undefined;
}
