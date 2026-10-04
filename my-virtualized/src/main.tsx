import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CORS from './CORS.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CORS />
  </StrictMode>,
)
