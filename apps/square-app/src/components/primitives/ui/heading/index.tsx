import { heading } from '@styled-system/recipes';
import { cx } from '@styled-system/css';
import type { HTMLAttributes } from 'react';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: '1' | '2' | '3' | '4' | '5' | '6';
}

export function Heading({ level = '1', className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return <Tag className={cx(heading({ level }), className)} {...props} />;
}
