import { ODProgrammerError } from "@open-decision/type-classes";
import { useActor, useInterpret } from "@xstate/react";
import * as React from "react";
import { websocketMachine, WebsocketService } from "../Data/websocket.machine";

export const WebsocketContext = React.createContext<WebsocketService | null>(
  null
);

type WebsocketProviderProps = Omit<
  React.ComponentProps<typeof WebsocketContext.Provider>,
  "value"
>;

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const service = useInterpret(websocketMachine, { devTools: true });

  return (
    <WebsocketContext.Provider value={service}>
      {children}
    </WebsocketContext.Provider>
  );
}

export function useWebsocket() {
  const websocketService = React.useContext(WebsocketContext);

  if (!websocketService) {
    throw new ODProgrammerError({
      code: "MISSING_CONTEXT_PROVIDER",
      message: "useAuth can only be used inside of an AuthProvider",
    });
  }

  return useActor(websocketService);
}
