import type { CSSProperties, ReactNode } from 'react';

export type RadioButtonProps = {
  value: string;
  name?: string;
  activeItem?: string;
  className?: string;
  style?: CSSProperties;
} & (
  | { label: string; children?: ReactNode }
  | { label?: string; children: ReactNode }
);
