'use client';

import styles from './Button.module.css';
import LoadingDots from '@/components/ui/LoadingDots';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'classnames';
import * as React from 'react';

const buttonVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles['variant-default'],
      destructive: styles['variant-destructive'],
      outline: styles['variant-outline'],
      secondary: styles['variant-secondary'],
      ghost: styles['variant-ghost'],
      link: styles['variant-link']
    },
    size: {
      default: styles['size-default'],
      sm: styles['size-sm'],
      lg: styles['size-lg'],
      icon: styles['size-icon']
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {loading && (
          <i className="flex pl-2 m-0">
            <LoadingDots />
          </i>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
