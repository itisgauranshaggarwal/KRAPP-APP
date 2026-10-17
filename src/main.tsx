import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

/* Self-hosted Fira Sans (no external CDN) */
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource/fira-sans/700.css'

import { App } from '@/App'
import { SessionProvider } from '@/lib/session'
import { ThemeProvider } from '@/lib/theme'
import { AppDataProvider } from '@/store/AppDataProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SessionProvider>
        <AppDataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppDataProvider>
      </SessionProvider>
    </ThemeProvider>
  </StrictMode>,
)
