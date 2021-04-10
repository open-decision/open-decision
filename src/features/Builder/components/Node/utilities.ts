import { TreeState } from "../../globalState";
import { connection } from "../../types";

export const getOutputConnections = (id: string) => (
  state: TreeState
): connection[] | undefined =>
  state.data.connections[id]?.length === 0
    ? undefined
    : state.data.connections[id];

export const getInputConnections = (outputId: string) => (
  state: TreeState
): connection[] =>
  Object.values(state.data.connections).reduce(
    (acc: connection[], connections) => {
      const connection = connections.find((inputId) => inputId === outputId);

      connection && acc.push(connection);

      return acc;
    },
    []
  );
