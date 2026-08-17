import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/Login.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './Contexts/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <useAuth>
          <App />
        </useAuth>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
