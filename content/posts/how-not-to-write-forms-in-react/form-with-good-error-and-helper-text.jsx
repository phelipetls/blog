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
        Username:{' '}
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={errorMessage !== '' ? 'true' : 'false'}
          aria-errormessage="username-errormessage"
          aria-describedby="username-description"
        />
      </label>

      {errorMessage && (
        <div
          id="username-errormessage"
          style={{
            color: 'red',
          }}
        >
          ❌ {errorMessage}
        </div>
      )}

      <div
        id="username-description"
        style={{
          fontSize: 10,
          color: 'grey',
        }}
      >
        This is what you'll use to log in
      </div>

      <button>Submit</button>
    </form>
  )
}
