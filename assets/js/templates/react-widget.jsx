{{ .SourceCode }}

const root = window.ReactDOM.createRoot(
  document.getElementById("{{ .AppRootId }}")
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)