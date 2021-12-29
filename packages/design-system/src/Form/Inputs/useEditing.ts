import * as React from "react";
import { useKey } from "react-use";

type Actions =
  | { type: "startEditing"; originalValue: string }
  | { type: "endEditing" };

type State = { isEditing: boolean; originalValue?: string };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "startEditing":
      return {
        isEditing: true,
        originalValue: action.originalValue,
      };
    case "endEditing": {
      return { ...state, isEditing: false };
    }

    default:
      return state;
  }
}

export function useEditing(
  ref: React.RefObject<HTMLInputElement>,
  disabled: boolean,
  onEscape: (originalValue: any) => void
) {
  const [state, dispatch] = React.useReducer(reducer, {
    isEditing: false,
  });
  const isEditing = disabled !== undefined ? !disabled : state.isEditing;

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

  React.useEffect(() => {
    if (isEditing) {
      ref.current?.select();
    } else {
      ref.current?.setSelectionRange(null, null);
    }
  }, [ref, isEditing]);

  return {
    isEditing,
    startEditing: (originalValue: any) =>
      dispatch({
        type: "startEditing",
        originalValue,
      }),
    endEditing: () => dispatch({ type: "endEditing" }),
  };
}
