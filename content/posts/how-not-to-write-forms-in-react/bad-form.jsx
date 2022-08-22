import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')

  const handleSubmit = () => {
    alert(`Ok, ${username}, I sent your data to our server ✨`)
  }

  return (
    <div>
      <div>
        What's your name?
        <input
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
