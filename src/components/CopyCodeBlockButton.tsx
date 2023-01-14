import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import IconButton, { IconButtonProps } from './IconButton'
import { Clipboard, Check } from 'lucide-react'
import { computePosition, offset, shift, arrow } from '@floating-ui/dom'
import clsx from 'clsx'

type DistributiveOmit<T, K extends string> = T extends unknown
  ? Omit<T, K>
  : never

export type CopyCodeBlockButtonProps = DistributiveOmit<
  IconButtonProps,
  'children'
> & {
  code: string
  tooltipText: string
}

export default function CopyCodeBlockButton(props: CopyCodeBlockButtonProps) {
  const { code, className, tooltipText, ...rest } = props

  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipArrowRef = useRef<HTMLDivElement>(null)

  const [showTooltip, setShowTooltip] = useState(false)

  // Circumvent 'document is not defined' error
  const [body, setBody] = useState<Element | null>(null)
  useEffect(() => {
    setBody(document.body)
  }, [])

  useEffect(() => {
    const showTooltip = async () => {
      if (!showTooltip) {
        return
      }

      const button = buttonRef.current
      const tooltip = tooltipRef.current
      const tooltipArrow = tooltipArrowRef.current

      if (!button || !tooltip || !tooltipArrow) {
        return
      }

      Object.assign(tooltip.style, {
        ...tooltip.style,
        animation: 'tooltip-animation 1.5s',
      })

      const { x, y, middlewareData } = await computePosition(button, tooltip, {
        placement: 'top',
        middleware: [
          shift({ padding: 8 }),
          offset(8),
          arrow({ element: tooltipArrow }),
        ],
      })

      Object.assign(tooltip.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
      })

      const arrowX = middlewareData.arrow?.x
      const arrowY = middlewareData.arrow?.y

      Object.assign(tooltipArrow.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        bottom: '-4px',
      })
    }

    showTooltip()
  }, [showTooltip])

  return (
    <IconButton
      ref={buttonRef}
      variant="rounded"
      className={clsx([
        'dark',
        'absolute',
        'right-0',
        'top-3',
        '-translate-x-1/2',
        'text-2xl',
        '[&_svg]:h-[1em] [&_svg]:w-[1em]',
        showTooltip && 'border-green-500',
        className,
      ])}
      onClick={async () => {
        await navigator.clipboard.writeText(code)

        setShowTooltip(true)

        setTimeout(() => {
          setShowTooltip(false)
        }, 1500)
      }}
      {...rest}
    >
      {showTooltip ? (
        <span className="text-green-500 [&_svg]:stroke-current">
          <Check />
        </span>
      ) : (
        <span className="text-[var(--code-fg)]">
          <Clipboard />
        </span>
      )}

      {body &&
        showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={clsx(
              'dark pointer-events-none absolute rounded border border-green-500 bg-background px-2 text-on-background'
            )}
          >
            {tooltipText}
            <div
              ref={tooltipArrowRef}
              className={clsx(
                'dark absolute h-[8px] w-[8px] rotate-45 border-r border-b border-green-500 bg-background'
              )}
            />
          </div>,
          body
        )}
    </IconButton>
  )
}
