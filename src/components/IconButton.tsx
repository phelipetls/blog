import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import Button, { ButtonProps } from './Button'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

export type IconButtonProps = DistributiveOmit<ButtonProps, 'color'> & {
  variant: 'rounded' | 'rounded-full'
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(
  (props, ref) => {
    const { className, variant = 'rounded', ...rest } = props

    return (
      <Button
        color="secondary"
        ref={ref}
        type="button"
        className={twMerge(
          clsx(
            'bg-background text-on-background',
            {
              'rounded-full p-2': variant === 'rounded-full',
              'rounded border border-divider p-1 shadow-sm shadow-shadow':
                variant === 'rounded',
            },
            className
          )
        )}
        {...rest}
      />
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
