import * as React from "react";

export function useInputFocus(): [
  React.MutableRefObject<HTMLElement | null>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [hasFocus, setHasFocus] = React.useState(false);
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (document.hasFocus() && ref.current?.contains(document.activeElement)) {
      setHasFocus(true);
    }
  }, [ref]);

  return [ref, hasFocus, setHasFocus];
}
