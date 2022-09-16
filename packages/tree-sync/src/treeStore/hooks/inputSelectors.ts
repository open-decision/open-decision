import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";
import { pick } from "remeda";

export function useInput(id: string) {
  const { tree } = useTreeContext();
  const {
    tree: { inputs },
  } = useSnapshot(tree);

  return inputs?.[id];
}

export function useInputs(ids: string[]) {
  const { tree } = useTreeContext();
  const {
    tree: { inputs },
  } = useSnapshot(tree);

  if (!inputs) return undefined;

  if (ids) return pick(inputs, ids);

  return inputs;
}
