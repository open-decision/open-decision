import "react-flow-renderer";
import type { NodePluginData } from "../state/useRFNodes";

declare module "react-flow-renderer" {
  interface Connection {
    source: string;
    target: string;
  }

  interface NodeProps {
    data: NodePluginData;
  }
}
