import * as React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type IconButtonCommonProps = {
  variant: 'rounded' | 'rounded-full'
  disabled?: boolean
}

type IconButtonLinkProps = Omit<
  React.ComponentPropsWithRef<'a'>,
  'href' & keyof IconButtonCommonProps
> & {
  href: string
}

type IconButtonButtonProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  keyof IconButtonCommonProps
> & {
  href?: never
}

export type IconButtonProps = IconButtonCommonProps &
  (IconButtonLinkProps | IconButtonButtonProps)

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(
  (props, ref) => {
    const className = React.useMemo(() => {
      return twMerge(
        clsx(
          'bg-surface',
          'hover:bg-hover',
          'text-on-background',
          'disabled:bg-disabled',
          'disabled:text-on-disabled',
          'disabled:hover:cursor-not-allowed',
          'disabled:hover:bg-disabled',
          'hover:text-primary',
          'transition-colors',
          'duration-300',
          {
            'min-w-[40px] h-[40px] flex justify-center items-center rounded-full px-2':
              props.variant === 'rounded-full',
            'rounded border border-divider p-1 shadow-sm shadow-shadow':
              props.variant === 'rounded',
          },
          props.className
        )
      )
    }, [])

    if (props.href !== undefined) {
      if (props.disabled) {
        return (
          <button
            ref={ref as React.ForwardedRef<HTMLButtonElement>}
            type='button'
            className={className}
            disabled={props.disabled}
          >
            {props.children}
          </button>
        )
      }

      const { variant: _, ...rest } = props

      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...rest}
          className={className}
        />
      )
    }

    const { variant: _, ...rest } = props

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type='button'
        {...rest}
        className={className}
      />
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
