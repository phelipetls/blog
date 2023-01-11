import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import Button, { ButtonProps } from './Button'

export type IconButtonProps = ButtonProps & {
  variant?: 'rounded' | 'rounded-full'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { className, variant = 'rounded', ...rest } = props

    return (
      <Button
        ref={ref}
        type="button"
        className={twMerge(
          clsx(
            'bg-background text-on-background',
            {
              ['rounded-full px-4 py-2']: variant === 'rounded-full',
              ['rounded border border-divider p-1 shadow shadow-shadow']:
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
