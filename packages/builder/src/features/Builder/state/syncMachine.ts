import { BuilderTree } from "@open-decision/type-classes";
import { assign, createMachine } from "xstate";

export const createSyncMachine = (syncFn: (tree: BuilderTree.TTree) => void) =>
  createMachine(
    {
      tsTypes: {} as import("./syncMachine.typegen").Typegen0,
      schema: {
        events: {} as { type: "sync"; data: BuilderTree.TTree },
        context: {} as { tree: BuilderTree.TTree | null },
      },
      id: "sync",
      initial: "idle",
      context: { tree: null },
      states: {
        idle: {
          on: {
            sync: {
              target: "sync",
              actions: "assignTreeToContext",
            },
          },
        },
        sync: {
          invoke: {
            src: "syncFn",
            onError: "error",
          },
          after: {
            3000: "idle",
          },
        },
        error: {},
      },
    },
    {
      actions: {
        assignTreeToContext: assign((_context, event) => ({
          tree: event.data,
        })),
      },
      services: {
        syncFn: (context) => async () =>
          context.tree != null ? await syncFn(context.tree) : null,
      },
    }
  );
