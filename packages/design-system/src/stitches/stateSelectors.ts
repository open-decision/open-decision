export const focusSelector =
  "&:focus-visible, &[data-focus='true'], &[data-focus-visible]";
export const focusSelectorWithin = `${focusSelector}, &:focus-within`;
export const hoverSelector = "&:hover";
export const intentSelector = "&:focus-visible, &[data-focus='true'], &:hover";
export const intentWithinSelector = `${intentSelector}, &:focus-within`;
export const activeSelector =
  "&:active, &[data-active='true'], &[data-active-item], &[data-state=on]";
export const disabledSelector = "&:disabled, &[data-disabled]";
