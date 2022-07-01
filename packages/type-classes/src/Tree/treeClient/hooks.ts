import { useSnapshot } from "valtio";
import { Tree } from "../type-classes";
import { createExtendedTreeClient } from "./createTreeClient";

export const createUseTree =
  <TClientConfig extends ReturnType<typeof createExtendedTreeClient>>(
    tree: Tree.TTree,
    treeClientConfig: TClientConfig
  ) =>
  <TSelector extends (treeClient: ReturnType<TClientConfig>) => any>(
    selector: TSelector
  ): ReturnType<TSelector> => {
    const treeSnapshot = useSnapshot(tree);
    const treeClient = treeClientConfig(treeSnapshot);

    return selector(treeClient);
  };
