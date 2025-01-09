import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export type TabProps = Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  value: string
  label: React.ReactNode
  selected?: boolean
}

export default function Tab(props: TabProps) {
  const { label, selected = false, className, ...rest } = props

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
      {...rest}
    >
      {label}
    </button>
  )
}
