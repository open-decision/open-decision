import * as localForage from "localforage";
import { TreeNode, TreeState, ValidTreeNode } from "../types";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { ValidationError } from "io-ts";
import { v4 as uuidv4 } from "uuid";
import create from "zustand";
import produce from "immer";

// const fetchTreesFromStorage = () => {
//   const localTrees: TreeState = {};

//   localForage.iterate((value, key, _index) => {
//     const onRight = (validTree: ValidTreeNode) => (localTrees[key] = validTree);
//     const onLeft = (errors: ValidationError[]) => console.warn(errors);

//     return pipe(TreeNode.decode(value), fold(onLeft, onRight));
//   });

//   return localTrees;
// };

type useTreesState = {
  trees: TreeState;
  initialize: () => void;
  createTree: (
    tree: CreateTreeData,
    callback?: (tree: ValidTreeNode) => void
  ) => void;
  deleteTree: (id: string, callback?: () => void) => void;
  updateTree: (
    id: string,
    tree: Partial<ValidTreeNode>,
    callback?: (tree: ValidTreeNode) => void
  ) => void;
};

type CreateTreeData = Omit<ValidTreeNode, "createdAt" | "tags"> &
  Partial<Pick<ValidTreeNode, "tags">>;

export const useTreeStore = create<useTreesState>((set) => ({
  trees: {},

  initialize: () => {
    const localTrees: TreeState = {};

    localForage
      .iterate((value, key, _index) => {
        const onRight = (validTree: ValidTreeNode) =>
          (localTrees[key] = validTree);
        const onLeft = (errors: ValidationError[]) => console.warn(errors);

        pipe(TreeNode.decode(value), fold(onLeft, onRight));
      })
      .then(() => {
        set({ trees: localTrees });
      });
  },

  createTree: async (tree, callback) => {
    const onLeft = (errors: ValidationError[]) => {
      throw new Error(
        `A Tree needs to be created with the format defined by TreeNode. The following errors have been produced: ${errors}
        )}`
      );
    };

    const onRight = (tree: ValidTreeNode) => {
      const id = uuidv4();

      try {
        localForage.setItem(id, tree).then((tree) => {
          set(
            produce((state: useTreesState) => {
              state.trees[id] = tree;
            })
          ),
            callback?.(tree);
        });
      } catch (error) {
        console.warn(error);
      }
    };

    return pipe(
      TreeNode.decode({ ...tree, createdAt: new Date().toISOString() }),
      fold(onLeft, onRight)
    );
  },

  deleteTree: async (id, callback) => {
    try {
      await localForage.removeItem(id);

      set(
        produce((state: useTreesState) => {
          delete state.trees[id];
        })
      );

      callback?.();
    } catch (error) {
      console.warn(
        `The tree with the ${id} could not be removed, because it doesn't exist. ${error}`
      );
    }
  },

  updateTree: async (id, newTree, callback) => {
    try {
      const oldTree = await localForage.getItem<ValidTreeNode>(id);

      if (oldTree == null) {
        throw new Error(`Tree ${id} does not exist`);
      }

      const updatedTree = { ...oldTree, ...newTree };

      await localForage.setItem(id, updatedTree);

      set(
        produce((state: useTreesState) => {
          state.trees[id] = updatedTree;
        })
      );

      callback?.(updatedTree);
    } catch (error) {
      throw new Error(`A non existent tree has been updated. ${error}`);
    }
  },
}));
