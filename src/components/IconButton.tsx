import clsx from 'clsx'
import Button, { ButtonProps } from './Button'

export type IconButtonProps = ButtonProps & {
  variant?: 'rounded' | 'rounded-full'
}

export default function IconButton(props: IconButtonProps) {
  const { className: className_, variant = 'rounded', ...rest } = props

  const className = clsx(
    {
      ['rounded-full px-4 py-2']: variant === 'rounded-full',
      ['rounded border border-divider p-1 shadow shadow-shadow']:
        variant === 'rounded',
    },
    className_
  )

  return <Button className={className} {...rest} />
}
