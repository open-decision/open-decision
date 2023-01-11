import { EntityPluginType } from "@open-decision/tree-type";
import { z } from "zod";
import { InputPlugin, InputPluginBaseType } from "../../helpers";

export const typeName = "placeholder";

const DataType = z.object({});

export const PlaceholderInputPluginType = InputPluginBaseType(
  typeName,
  DataType
);

export type IPlaceholderInput = EntityPluginType<
  typeof PlaceholderInputPluginType
>;

export class PlaceholderInputPlugin extends InputPlugin<IPlaceholderInput> {
  constructor() {
    super(typeName, PlaceholderInputPluginType);
  }
}
