import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export type TabProps = Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  value: string
  label: React.ReactNode
  selected?: boolean
  onChange?: (value: string) => void
}

export default function Tab(props: TabProps) {
  const {
    label,
    selected = false,
    value,
    onChange,
    onClick,
    className,
    ...rest
  } = props

  return (
    <button
      type='button'
      role='tab'
      aria-selected={selected ? 'true' : 'false'}
      className={twMerge(
        clsx(
          'bg-background',
          'text-on-background',
          'rounded-t',
          'p-2',
          'transition-colors',
          'duration-300',
          'hover:bg-hover',
          {
            'border-b border-primary font-bold': selected,
          },
          className
        )
      )}
      onClick={(event) => {
        if (!selected && onChange) {
          onChange(value)
        }

        if (onClick) {
          onClick(event)
        }
      }}
      {...rest}
    >
      {label}
    </button>
  )
}
