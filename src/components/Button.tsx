import clsx from 'clsx'
import React, { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

type CommonButtonProps = {
  color?: 'primary' | 'secondary'
  children: React.ReactNode
}

type ButtonLinkProps = CommonButtonProps &
  Omit<React.ComponentPropsWithRef<'a'>, 'href'> & {
    href: string
  }

type ButtonButtonProps = CommonButtonProps &
  React.ComponentPropsWithRef<'button'> & {
    href?: never
  }

export type ButtonProps = ButtonLinkProps | ButtonButtonProps

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (props, ref) => {
    const className = useMemo(() => {
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
    }, [props.className, props.color])

    if (props.href !== undefined) {
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...props}
          className={className}
        />
      )
    }

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...props}
        className={className}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button
