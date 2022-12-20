import "reactflow";
import "valtio";

// import type { NodePluginData, NodePluginProps } from "../state/useRFNodes";

declare module "reactflow" {
  interface Connection {
    source: string;
    target: string;
  }
}

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
