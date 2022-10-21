import "reactflow";
import "valtio";

import type { NodePluginData } from "../state/useRFNodes";

declare module "reactflow" {
  interface Connection {
    source: string;
    target: string;
  }

  interface NodeProps {
    data: NodePluginData;
  }
}

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
