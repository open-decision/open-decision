import { styled } from "@open-decision/design-system";
import { Handle } from "reactflow";

const portWidth = 18;

export const Port = styled(Handle, {
  backgroundColor: "$gray1 !important",
  border: "1px solid $gray8 !important",
  height: `${portWidth}px !important`,
  width: `${portWidth}px !important`,

  "&[data-connecting='true'][data-connectable='false']": {
    cursor: "not-allowed",
  },
});
export const TargetPort = styled(Port, {
  top: `-${portWidth / 2}px !important`,
  opacity: 0,

  "&[data-connecting='true'][data-connectingnode='false'][data-connectable='true']:hover":
    {
      border: "1px solid $colors$primary9 !important",
      boxShadow: "0px 0px 0px 1px $colors$primary9, $2",
    },
});

export const SourcePort = styled(Port, {
  bottom: `-${(portWidth - 2) / 2}px !important`,
  border: "1px solid",

  "&[data-active='true']": {
    boxShadow: "0px 0px 0px 1px $colors$primary9, $2",
    borderColor: "$primary9 !important",
  },

  "&:hover": {
    borderColor: "$primary9 !important",
  },
});
