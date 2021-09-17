import * as T from "io-ts";
import { Required } from "utility-types";
import { ArrowHeadType } from "react-flow-renderer";

export const Type = T.intersection([
  T.type({
    id: T.string,
    source: T.string,
    target: T.string,
  }),
  T.partial({
    type: T.string,
    label: T.string,
    animated: T.boolean,
    isHidden: T.boolean,
  }),
]);

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
    arrowHeadType: ArrowHeadType.Arrow,
    id: createId(connectionParams),
  };
};

export const ConnectionsRecord = T.record(T.string, Type);

export type TConnectionsRecord = T.TypeOf<typeof ConnectionsRecord>;
export type TConnection = T.TypeOf<typeof Type> & {
  arrowHeadType?: ArrowHeadType;
};
