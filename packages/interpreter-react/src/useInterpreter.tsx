import { ODProgrammerError } from "@open-decision/type-classes";
import * as React from "react";
import {
  createInterpreterMachine,
  InterpreterService,
  createInterpreterMethods,
  InterpreterEvents,
  InterpreterOptions,
  Resolver,
  getCurrentNode,
} from "@open-decision/interpreter";
import type { InterpreterContext } from "@open-decision/interpreter";
import { useActor, useInterpret } from "@xstate/react";
import { InterpreterOptions as XStateInterpreterOptions } from "xstate";
import { UseMachineOptions } from "@xstate/react/lib/types";
import { ErrorCard, Stack } from "@open-decision/design-system";
import {
  IEdgePlugin,
  ReadOnlyTreeClient,
  TReadOnlyTreeClient,
  Tree,
} from "@open-decision/tree-type";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";

function createResolver(
  treeClient: TReadOnlyTreeClient,
  edgePlugins: Record<string, EdgePluginObject>
) {
  const resolvers = (edge: IEdgePlugin) => {
    const edgeResolver = edgePlugins[edge.type].resolver(treeClient);

    if (!edgeResolver) {
      console.error(edge);
      throw new ODProgrammerError({
        code: "INVALID_EDGES",
        message: `The edge provided to the interpreter is not a found in the plugins. Make sure to include it in the edgePlugins passed to the Renderer.Root.`,
      });
    }

    return edgeResolver(edge);
  };

  const resolver: Resolver = (context, event) => (callback) => {
    const currentNode = getCurrentNode(treeClient, context);

    if (currentNode.final) {
      callback({ type: "FINAL_INTERPRETATION" });
    }

    const edges = treeClient.edges.get.byNode(currentNode.id)?.source;

    for (const edgeId in edges) {
      const edge = edges[edgeId];

      const edgeResolver = resolvers(edge);

      const result = edgeResolver(context, event);

      // If the result is false the condtion was not true and we
      // can continue with the next condition.
      if (result.state === "failure") continue;

      // If the result is an error we fail the interpretation, because
      // we can not resolve the tree correctly.
      // See the error message for what went wrong.
      if (result.state === "error")
        return callback({
          type: "INVALID_INTERPRETATION",
          error: result.error,
        });

      callback({ type: "VALID_INTERPRETATION", target: result.target });
    }
  };

  return resolver;
}

type Context = {
  service: InterpreterService;
  tree: Tree.TTree;
  environment: InterpreterOptions["environment"];
  isInteractive: boolean;
};

const MachineContext = React.createContext<Context | null>(null);

export type InterpreterProviderProps = {
  children: React.ReactNode;
  tree: Tree.TTree;
  config?: XStateInterpreterOptions &
    UseMachineOptions<InterpreterContext, InterpreterEvents>;
  edgePlugins: Record<string, EdgePluginObject>;
} & InterpreterOptions;

export function InterpreterProvider({
  children,
  tree,
  config,
  edgePlugins,
  ...options
}: InterpreterProviderProps) {
  const readOnlyTreeClient = new ReadOnlyTreeClient(tree);

  const [[interpreterMachine]] = React.useState(
    React.useState(
      createInterpreterMachine(
        tree,
        Tree.Type,
        createResolver(readOnlyTreeClient, edgePlugins),
        options
      )
    )
  );

  if (interpreterMachine instanceof Error)
    return (
      <Stack className="h-full" center>
        <ErrorCard error={interpreterMachine} className="max-w-[600px]" />
      </Stack>
    );

  const service = useInterpret(interpreterMachine, config);

  return (
    <MachineContext.Provider
      value={{
        service,
        tree,
        environment: options.environment,
        isInteractive: options?.isInteractive ?? true,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
}

export function useInterpreterService() {
  const context = React.useContext(
    MachineContext as unknown as React.Context<Context>
  );

  if (!context)
    throw new ODProgrammerError({
      message:
        "useInterpreter or useInterpreterService can only be used inside of an InterpreterProvider",
      code: "MISSING_CONTEXT_PROVIDER",
    });

  return context;
}

export function useInterpreter() {
  const { service, tree, environment, isInteractive } = useInterpreterService();

  const [state, send] = useActor(service);

  const methods = React.useMemo(() => {
    return createInterpreterMethods(state.context, tree);
  }, [state.context, tree]);

  return { state, send, tree, environment, isInteractive, ...methods };
}

export function useInterpreterTree<TReturn>(
  selector: (ReadOnlyTreeClient: ReadOnlyTreeClient<Tree.TTree>) => TReturn
) {
  const { tree } = useInterpreterService();

  const readOnlyTreeClient = new ReadOnlyTreeClient(tree);

  return selector(readOnlyTreeClient);
}
