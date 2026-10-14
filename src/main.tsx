import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { RoleProvider } from './lib/role'
import { SettingsProvider } from './lib/settings'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoleProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </RoleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
