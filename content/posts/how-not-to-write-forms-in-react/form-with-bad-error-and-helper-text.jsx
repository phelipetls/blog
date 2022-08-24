import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')

  let errorMessage = ''

  if (username && !/^[A-Za-z0-9]+$/.test(username)) {
    errorMessage = 'Only alphanumeric characters allowed'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      {errorMessage && (
        <div
          style={{
            color: 'red',
          }}
        >
          ❌ {errorMessage}
        </div>
      )}

      <div
        style={{
          fontSize: 10,
          color: 'grey',
        }}
      >
        Your username should have only alphanumeric characters
      </div>

      <button>Submit</button>
    </form>
  )
}
