import { useState } from 'react'
import IconButton, { IconButtonProps } from './IconButton'
import { Clipboard, Check, X } from 'lucide-react'
import clsx from 'clsx'

type DistributiveOmit<T, K extends string> = T extends unknown
  ? Omit<T, K>
  : never

export type CopyCodeBlockButtonProps = DistributiveOmit<
  IconButtonProps,
  'children' | 'variant'
> & {
  code: string
  successText: string
  errorText: string
}

export default function CopyCodeBlockButton(props: CopyCodeBlockButtonProps) {
  const { code, className, successText, errorText, ...rest } = props

  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | 'idle'>(
    'idle'
  )
  const justCopied = copyStatus !== 'idle'
  const error = copyStatus === 'error'

  return (
    <IconButton
      variant='rounded'
      aria-label={justCopied ? (error ? errorText : successText) : 'Copy code'}
      className={clsx([
        justCopied ? (error ? 'border-warn' : 'border-green-500') : '',
        className,
      ])}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setCopyStatus('success')
        } catch {
          setCopyStatus('error')
        } finally {
          setTimeout(() => {
            setCopyStatus('idle')
          }, 1000)
        }
      }}
      {...rest}
    >
      {justCopied ? (
        <span
          className={clsx(
            '[&_svg]:stroke-current',
            justCopied ? (error ? 'text-warn' : 'text-green-500') : ''
          )}
        >
          {error ? <X /> : <Check />}
        </span>
      ) : (
        <span className='text-[var(--code-fg)]'>
          <Clipboard />
        </span>
      )}
    </IconButton>
  )
}
