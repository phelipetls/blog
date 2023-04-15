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
  successTooltipText: string
  errorTooltipText: string
}

export default function CopyCodeBlockButton(props: CopyCodeBlockButtonProps) {
  const { code, className, successTooltipText, errorTooltipText, ...rest } =
    props

  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipArrowRef = useRef<HTMLDivElement>(null)

  const [tooltipText, setTooltipText] = useState<string | null>(null)
  const shouldShowTooltip = tooltipText !== null
  const isError = tooltipText === errorTooltipText

  // Circumvent 'document is not defined' error
  const [body, setBody] = useState<Element | null>(null)
  useEffect(() => {
    setBody(document.body)
  }, [])

  useEffect(() => {
    const tooltip = tooltipRef.current

    if (!tooltip) {
      return
    }

    const showTooltip = async () => {
      if (!shouldShowTooltip) {
        return
      }

      const button = buttonRef.current
      const tooltipArrow = tooltipArrowRef.current

      if (!button || !tooltipArrow) {
        return
      }

      const { x, y, middlewareData } = await computePosition(button, tooltip, {
        placement: 'top',
        middleware: [
          shift({ padding: 8 }),
          offset(8),
          arrow({ element: tooltipArrow }),
        ],
      })

      const arrowX = middlewareData.arrow?.x
      const arrowY = middlewareData.arrow?.y

      tooltip.style.left = x != null ? `${x}px` : ''
      tooltip.style.top = y != null ? `${y}px` : ''
      tooltip.style.animation = `tooltip-animation 1.5s forwards`

      tooltipArrow.style.left = arrowX != null ? `${arrowX}px` : ''
      tooltipArrow.style.top = arrowY != null ? `${arrowY}px` : ''
      tooltipArrow.style.bottom = '-4px'
    }

    showTooltip()

    const hideTooltip = () => {
      setTooltipText(null)
    }

    tooltip?.addEventListener('animationend', hideTooltip)

    return () => {
      tooltip?.removeEventListener('animationend', hideTooltip)
    }
  }, [shouldShowTooltip])

  return (
    <IconButton
      ref={buttonRef}
      className={clsx([
        isError ? 'border-warn' : 'border-green-500',
        className,
      ])}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setTooltipText(successTooltipText)
        } catch {
          setTooltipText(errorTooltipText)
        }
      }}
      {...rest}
    >
      {shouldShowTooltip ? (
        <span
          className={clsx(
            '[&_svg]:stroke-current',
            isError ? 'text-warn' : 'text-green-500'
          )}
        >
          <Check />
        </span>
      ) : (
        <span className="text-[var(--code-fg)]">
          <Clipboard />
        </span>
      )}

      {body &&
        shouldShowTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={clsx(
              'dark pointer-events-none absolute rounded border bg-background px-2 text-on-background',
              isError ? 'border-warn' : 'border-green-500'
            )}
          >
            {tooltipText}
            <div
              ref={tooltipArrowRef}
              className={clsx(
                'absolute h-[8px] w-[8px] rotate-45 border-b border-r bg-background',
                isError ? 'border-warn' : 'border-green-500'
              )}
            />
          </div>,
          body
        )}
    </IconButton>
  )
}
