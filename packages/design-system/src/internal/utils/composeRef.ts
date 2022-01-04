import * as React from "react";

export function useComposedRefs<T>(forwardedRef: React.Ref<T>) {
  // final ref that will share value with forward ref. this is the one we will attach to components
  const innerRef = React.useRef<T>(null);

  React.useEffect(() => {
    // after every render - try to share current ref value with forwarded ref
    if (!forwardedRef) return;

    if (typeof forwardedRef === "function") {
      forwardedRef(innerRef.current);
      return;
    } else {
      // @ts-expect-error - by default forwardedRef.current is readonly. Let's ignore it
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
}

type ReactRef<T> = React.Ref<T> | React.MutableRefObject<T>;

export function assignRef<T = any>(ref: ReactRef<T> | undefined, value: T) {
  if (ref == null) return;

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  try {
    // @ts-expect-error - by default ref.current is readonly. Let's ignore it
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

/**
 * React hook that merges react refs into a single memoized function
 *
 * @example
 * import React from "react";
 * import { useMergeRefs } from `@chakra-ui/hooks`;
 *
 * const Component = React.forwardRef((props, ref) => {
 *   const internalRef = React.useRef();
 *   return <div {...props} ref={useMergeRefs(internalRef, ref)} />;
 * });
 */
export function useMergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (node: T) => {
      refs.forEach((ref) => {
        if (ref) assignRef(ref, node);
      });
    };
  }, [refs]);
}
