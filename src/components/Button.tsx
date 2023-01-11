import clsx from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type CommonButtonProps = {
  color?: 'primary' | 'secondary'
}

export type ButtonProps = CommonButtonProps &
  React.ComponentPropsWithRef<'button'>

function getButtonClassName(props: Pick<ButtonProps, 'color' | 'className'>) {
  const { color, className } = props

  const merged = twMerge(
    clsx(
      'flex',
      'items-center',
      'justify-center',
      'flex-row',
      'gap-2',
      'transition-colors',
      'duration-300',
      'hover:bg-hover',
      'disabled:bg-disabled',
      'disabled:text-on-disabled',
      'disabled:hover:cursor-not-allowed',
      'disabled:hover:bg-disabled',
      'rounded-full px-4 py-2',
      {
        ['bg-primary text-on-primary hover:bg-primary-hover']:
          color === 'primary',
        ['bg-surface text-on-background']: color === 'secondary',
      },
      className
    )
  )

  return merged
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { color, className, ...rest } = props

    return (
      <button
        ref={ref}
        className={getButtonClassName({ color, className })}
        {...rest}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button
