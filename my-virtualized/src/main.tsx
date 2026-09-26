import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Keep DebugApp available for quick debugging but don't render it currently
// DebugApp import intentionally left for quick local testing; unused at runtime
// DebugApp is available at src/DebugApp.tsx for quick manual testing

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
