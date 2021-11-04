import * as React from "react";
import { z } from "zod";
import { Required } from "utility-types";

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  label: z.string().optional(),
  animated: z.boolean().optional(),
  isHidden: z.boolean().optional(),
});

type getConnectionParameters = Required<
  Partial<TConnection>,
  "source" | "target"
>;

export const createId = ({ source, target }: getConnectionParameters): string =>
  `${source}-${target}`;

export const create = (
  connectionParams: Omit<TConnection, "id">
): TConnection => {
  return {
    ...connectionParams,
    id: createId(connectionParams),
  };
};

export const ConnectionsRecord = z.record(Type);

export type TConnectionsRecord = z.infer<typeof ConnectionsRecord>;
export type TConnection = z.infer<typeof Type> & {
  style?: React.CSSProperties;
};
