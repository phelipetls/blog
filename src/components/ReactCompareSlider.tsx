import Button from '@components/Button'
import {
  ReactCompareSlider as OriginalReactCompareSlider,
  ReactCompareSliderProps,
  ReactCompareSliderImage,
} from 'react-compare-slider'
import { MoveHorizontal } from 'lucide-react'

export function ReactCompareSlider(props: ReactCompareSliderProps) {
  return (
    <OriginalReactCompareSlider
      handle={
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex-1 border-l-2 border-divider" />

          <div className="relative h-10 w-10 rounded-full border-2 border-divider">
            <div className="pointer-events-none absolute inset-0 h-full w-full rounded-full backdrop-blur-sm" />

            <Button
              icon
              className="dark h-full w-full cursor-move rounded-full border-0 backdrop-blur-none"
            >
              {/* FIXME: use MoveVertical icon if portrait prop is false */}
              <MoveHorizontal className="dark" />
            </Button>
          </div>

          <div className="flex-1 border-l-2 border-divider" />
        </div>
      }
      {...props}
    />
  )
}

export { ReactCompareSliderImage }
