import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutesPages from './routespages.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutesPages />
  </StrictMode>,
)
