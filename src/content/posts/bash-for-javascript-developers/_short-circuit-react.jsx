import { useState } from 'react'

function App() {
  const [isShown, setIsShown] = useState(false)

  return (
    <div>
      <button onClick={() => setIsShown(!isShown)}>
        {isShown ? 'Hide me' : 'Show me'}
      </button>

      {isShown && <div>😊</div>}
    </div>
  )
}
