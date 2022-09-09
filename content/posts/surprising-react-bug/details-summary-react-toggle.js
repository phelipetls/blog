import { useState } from 'react'

export function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span>State: {isOpen ? 'open' : 'closed'}</span>

      <details
        open={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen)
        }}
      >
        <summary>Summary</summary>
        Details
      </details>
    </>
  )
}
