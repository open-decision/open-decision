import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";

/** Please note! When subscribed to this hook the component is going to rerender when any part of the
 * tree is changed. If possible a more specific hook should be used.
 */
export function useFullTree() {
  const { tree } = useTreeContext();

  return useSnapshot(tree);
}
