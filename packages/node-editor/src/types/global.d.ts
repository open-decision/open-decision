import "reactflow";
import "valtio";

declare module "reactflow" {
  interface Connection {
    source: string;
    target: string;
  }
}

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}
