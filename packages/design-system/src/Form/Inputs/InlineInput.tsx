import * as React from "react";
import { styled } from "../../stitches";
import { Box } from "../../Box";
import { InputProps } from "./Input";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { useComposedRefs } from "../../internal/utils";
import { useKey, useMeasure } from "react-use";
import { useFormContext, useWatch } from "react-hook-form";

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

const StyledBox = styled(Box, baseInputStyles, {
  border: 0,
  display: "flex",
  alignItems: "center",

  "&:focus-within": {
    boxShadow: "none",
  },
});

const StyledInput = styled("input", baseTextInputStyle, {
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$2",
  $$width: "0px",
  paddingInline: "$$paddingInline",
  paddingBlock: "$$paddingBlock",
  backgroundColor: "transparent",
  outline: "none",
  //FIXME Stitches has an open issue in regards to the order in which classNames are applied -> https://github.com/modulz/stitches/issues/671
  // Since Input is not directly a styled component the order of the styles is not controlled correctly.
  borderColor: "transparent !important",
  boxShadow: "none !important",
  boxSizing: "content-box",
  textStyle: "inherit",

  "&:focus-visible": {
    boxShadow: "none",
    outline: "none",
  },
});

const SizingSpan = styled("span", {
  paddingInline: "$2",
  textStyle: "medium-text",
  whiteSpace: "pre-wrap",
});

export type InlineInputProps = InputProps & { IndicatorButton?: JSX.Element };

const InlineInputImpl = (
  {
    name,
    alignByContent,
    disabled,
    Buttons,
    IndicatorButton,
    css,
    ...props
  }: InlineInputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) => {
  const { register, setValue, formState } = useFormContext();
  const inputValue = useWatch({ name });

  const { ref, ...inputProps } = register(name, { disabled, ...props });
  const innerRef = useComposedRefs(forwardedRef);
  const [wrapperRef, { width }] = useMeasure<HTMLSpanElement>();

  const [state, dispatch] = React.useReducer(reducer, {
    isEditing: false,
  });
  const isEditing = disabled !== undefined ? !disabled : state.isEditing;

  useKey("Enter", () => dispatch({ type: "endEditing" }));
  useKey(
    "Escape",
    () => {
      state.originalValue != null && setValue(name, state.originalValue);
      dispatch({ type: "endEditing" });
    },
    undefined,
    [state]
  );

  React.useEffect(() => {
    if (isEditing) {
      innerRef.current?.select();
    } else {
      innerRef.current?.setSelectionRange(null, null);
    }
  }, [innerRef, isEditing]);

  const EnhancedIndicatorButton = IndicatorButton
    ? React.cloneElement(IndicatorButton, {
        "data-active": isEditing,
        onClick: () =>
          dispatch({ type: "startEditing", originalValue: formState[name] }),
        type: "button",
        disabled,
      })
    : IndicatorButton;

  return (
    <StyledBox
      css={{ color: disabled ? "$gray8" : "$gray12" }}
      data-disabled={disabled}
    >
      <StyledInput
        {...inputProps}
        ref={(e) => {
          ref(e);
          // @ts-expect-error - by default forwardedRef.current is readonly. Let's ignore it
          innerRef.current = e;
        }}
        alignByContent={alignByContent}
        css={{
          width: `${width}px`,
          ...css,
        }}
      />
      <SizingSpan
        ref={wrapperRef}
        style={{
          position: "absolute",
          left: "-9999px",
          display: "inline-block",
        }}
      >
        {inputValue}
      </SizingSpan>
      {EnhancedIndicatorButton}
      {Buttons}
    </StyledBox>
  );
};

export const InlineInput = React.forwardRef(InlineInputImpl);
