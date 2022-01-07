import * as React from "react";
import { useKey } from "react-use";

type Actions =
  | { type: "startEditing"; originalValue: string }
  | { type: "endEditing" };

type State = { isEditing: boolean; disabled?: boolean; originalValue?: string };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "startEditing": {
      if (!state.disabled)
        return {
          isEditing: true,
          originalValue: action.originalValue,
        };

      return state;
    }
    case "endEditing": {
      return { ...state, isEditing: false };
    }

    default:
      return state;
  }
}

export function useEditing(
  ref: React.Ref<HTMLInputElement>,
  disabled: boolean,
  onEscape: (originalValue: any) => void
) {
  const [state, dispatch] = React.useReducer(reducer, {
    isEditing: false,
    disabled,
  });

  useKey("Enter", () => dispatch({ type: "endEditing" }));
  useKey(
    "Escape",
    () => {
      state.originalValue != null && onEscape(state.originalValue);
      dispatch({ type: "endEditing" });
    },
    undefined,
    [state]
  );

  const endEditing = () => dispatch({ type: "endEditing" });

  React.useEffect(() => {
    if (state.isEditing) {
      typeof ref === "object" ? ref?.current?.select() : null;
    } else {
      typeof ref === "object"
        ? ref?.current?.setSelectionRange(null, null)
        : null;
    }
  }, [ref, state.isEditing]);

  return {
    isEditing: state.isEditing,
    startEditing: (originalValue: any) =>
      dispatch({
        type: "startEditing",
        originalValue,
      }),
    endEditing,
  };
}
