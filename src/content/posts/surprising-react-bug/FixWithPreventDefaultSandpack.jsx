import Sandpack from '@components/Sandpack'
import outdent from 'outdent'

export default function () {
  return (
    <Sandpack
      template="react"
      title="Fixed bug when using details element with React, using preventDefault"
      files={{
        'App.js': outdent`
          import { useState } from 'react'

          export default function App() {
            const [isOpen, setIsOpen] = useState(false)

            return (
              <>
                <span>State: {isOpen ? 'open' : 'closed'}</span>

                <details open={isOpen}>
                  <summary
                    onClick={(e) => {
                      e.preventDefault()
                      setIsOpen(!isOpen)
                    }}
                  >
                    Summary
                  </summary>
                  Details
                </details>
              </>
            )
          }
        `,
      }}
    />
  )
}
