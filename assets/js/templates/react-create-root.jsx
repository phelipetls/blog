{{ .SourceCode }}

const appRoot = document.getElementById("{{ .AppRootId }}")

if ('createRoot' in window.ReactDOM) {
  const root = window.ReactDOM.createRoot(appRoot)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  window.ReactDOM.render(<App />, appRoot)
}
