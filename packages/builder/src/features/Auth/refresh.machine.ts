import { isBefore } from "date-fns";
import { createMachine } from "xstate";

type Events = { type: "REFRESH" };
type Context = { expires?: string };

export const refreshMachine = createMachine<Context, Events>(
  {
    id: "refreshMachine",
    initial: "idle",
    context: { expires: undefined },
    states: {
      idle: {
        after: {
          100: [
            {
              target: "refresh",
              cond: "hasTokenExpired",
            },
            { target: "idle" },
          ],
        },
      },
      refresh: {
        type: "final",
      },
    },
  },
  {
    guards: {
      hasTokenExpired: (context) => {
        return context.expires
          ? isBefore(new Date(context.expires), new Date())
          : true;
      },
    },
  }
);
