import "reactflow";
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
