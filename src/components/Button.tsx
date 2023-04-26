import clsx from 'clsx'
import React, { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

type CommonButtonProps = {
  color?: 'primary' | 'secondary'
  disabled?: boolean
  children: React.ReactNode
  startIcon?: React.ReactNode
  size?: 'normal' | 'huge'
}

type ButtonLinkProps = Omit<
  React.ComponentPropsWithRef<'a'>,
  'href' & keyof CommonButtonProps
> & {
  href: string
}

type ButtonButtonProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  keyof CommonButtonProps
> & {
  href?: never
}

export type ButtonProps = CommonButtonProps &
  (ButtonLinkProps | ButtonButtonProps)

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (props, ref) => {
    const mergedClassName = useMemo(() => {
      const { color = 'primary', size = 'normal', className } = props

      const merged = twMerge(
        clsx(
          'flex',
          'items-center',
          'justify-center',
          'flex-row',
          '[&_*:first-child]:shrink-0',
          'gap-2',
          'transition-colors',
          'duration-300',
          'hover:bg-hover',
          'disabled:bg-disabled',
          'disabled:text-on-disabled',
          'disabled:hover:cursor-not-allowed',
          'disabled:hover:bg-disabled',
          size === 'normal' ? 'rounded py-1 px-2' : 'px-4 py-2 rounded-full',
          {
            ['bg-primary text-on-primary hover:bg-primary-hover shadow-sm shadow-shadow']:
              color === 'primary',
            ['text-on-background']: color === 'secondary',
          },
          className
        )
      )

      return merged
    }, [props.className, props.color])

    if (props.href !== undefined) {
      if (props.disabled) {
        return (
          <button
            ref={ref as React.ForwardedRef<HTMLButtonElement>}
            disabled={props.disabled}
            className={mergedClassName}
          >
            {props.startIcon}
            {props.children}
          </button>
        )
      }

      const { startIcon, children, size: _, color: __, ...rest } = props

      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...rest}
          className={mergedClassName}
        >
          {startIcon}
          {children}
        </a>
      )
    }

    const { startIcon, children, size: _, color: __, ...rest } = props

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...rest}
        className={mergedClassName}
      >
        {startIcon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
