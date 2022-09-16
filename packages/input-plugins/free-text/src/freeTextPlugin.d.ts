import { InputPlugin, TBaseTreeClient } from "@open-decision/type-classes";
import { Type } from "./types";
import { DirectPlugin } from "@open-decision/direct-condition-plugin";
import { z } from "zod";
export declare type TFreeTextInput = z.infer<FreeTextPlugin["MergedType"]>;
export declare class FreeTextPlugin extends InputPlugin<typeof Type, "freeText"> {
    directConditionPlugin: DirectPlugin;
    constructor(treeClient: TBaseTreeClient);
    create(data: Omit<z.infer<typeof this.SpecificType>, "type">): z.infer<typeof this.MergedType>;
    createTargetNode(nodeId: string, inputId: string, data: {
        name: string;
    }): Error | {
        id: string;
        label: string | undefined;
    };
    updateTarget({ nodeId, inputId, newItem, edgeId, }: {
        nodeId: string;
        inputId: string;
        newItem: string;
        edgeId?: string;
    }): void;
}
