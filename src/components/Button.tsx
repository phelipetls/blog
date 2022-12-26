import clsx from 'clsx'

type CommonButtonProps = {
  variant?: 'primary' | 'secondary'
  icon?: boolean
  iconAction?: boolean
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

type ButtonProps = ButtonLinkProps | ButtonButtonProps

function getButtonClassName(props: ButtonProps) {
  const { variant, icon, iconAction, className } = props

  return clsx(
    'transition-colors',
    'duration-500',
    'hover:bg-hover',
    'disabled:bg-disabled',
    'disabled:text-on-disabled',
    'disabled:hover:cursor-not-allowed',
    'disabled:hover:bg-disabled',
    {
      ['rounded-full px-4 py-2']: icon === false,
      ['bg-primary text-on-primary hover:bg-primary-hover']:
        variant === 'primary',
      ['bg-surface text-on-background']: variant === 'secondary',
      ['flex items-center justify-center rounded p-1 text-on-background']:
        icon === true,
      ['border border-divider shadow shadow-shadow']: iconAction === true,
    },
    className
  )
}

export default function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    return <a {...props} className={getButtonClassName(props)} />
  }

  return <button {...props} className={getButtonClassName(props)} />
}
