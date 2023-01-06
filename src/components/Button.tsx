import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type CommonButtonProps = {
  color?: 'primary' | 'secondary'
  children: React.ReactNode
}

type ButtonLinkProps = CommonButtonProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & {
    href: string
  }

type ButtonButtonProps = CommonButtonProps &
  React.ComponentPropsWithoutRef<'button'> & {
    href?: never
  }

export type ButtonProps = ButtonLinkProps | ButtonButtonProps

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

export default function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { color, className, ...rest } = props
    return <a className={getButtonClassName({ color, className })} {...rest} />
  }

  const { color, className, ...rest } = props
  return (
    <button className={getButtonClassName({ color, className })} {...rest} />
  )
}
