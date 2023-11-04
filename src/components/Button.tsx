import clsx from 'clsx'
import React, { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

type CommonButtonProps = {
  color?: 'primary' | 'secondary'
  disabled?: boolean
  children: React.ReactNode
  size?: 'normal' | 'huge'
  endIcon?: React.ReactNode
  startIcon?: React.ReactNode
}

type PropsOf<T extends React.ElementType> = React.ComponentPropsWithRef<T>

type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>['ref']

type PolymorphicProps<
  T extends React.ElementType = React.ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TProps = {}
> = {
  as?: T
} & TProps &
  Omit<PropsOf<T>, keyof TProps | 'as' | 'ref'> & { ref?: PolymorphicRef<T> }

export type ButtonProps<T extends React.ElementType = 'button'> =
  PolymorphicProps<T, CommonButtonProps>

type ButtonComponent = <T extends React.ElementType = 'button'>(
  props: PolymorphicProps<T, ButtonProps<T>>
) => React.ReactElement | null

export const Button: ButtonComponent = React.forwardRef(function InnerButton<
  T extends React.ElementType = 'button'
>(props: ButtonProps<T>, ref: PolymorphicRef<T>) {
  const mergedClassName = useMemo(() => {
    const { color = 'primary', size = 'normal', className } = props

    const merged = twMerge(
      clsx(
        'flex',
        'items-center',
        'justify-center',
        'flex-row',
        'transition-colors',
        'duration-300',
        'hover:bg-hover',
        'disabled:bg-disabled',
        'disabled:text-on-disabled',
        'disabled:hover:cursor-not-allowed',
        'disabled:hover:bg-disabled',
        'rounded-full',
        'whitespace-nowrap',
        size === 'normal' ? 'py-1 px-2' : 'py-2 px-4',
        {
          ['bg-primary text-on-primary hover:bg-primary-hover shadow-sm shadow-shadow']:
            color === 'primary',
          ['bg-surface text-on-background']: color === 'secondary',
        },
        className
      )
    )

    return merged
  }, [props.className, props.color])

  const {
    as,
    size: _,
    color: __,
    children,
    startIcon,
    endIcon,
    ...rest
  } = props
  const Component = as ?? 'button'

  return (
    <Component ref={ref} {...rest} className={mergedClassName}>
      <div className='pr-2'>{startIcon}</div>

      {children}

      <div className='pl-2'>{endIcon}</div>
    </Component>
  )
})

export default Button
