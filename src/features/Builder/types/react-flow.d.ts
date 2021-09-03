import "react-flow-renderer";

declare module "react-flow-renderer" {
  interface Connection {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }
}
