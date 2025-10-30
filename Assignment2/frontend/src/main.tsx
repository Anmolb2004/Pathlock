import React from 'react'
import ReactDOM from 'react-dom/client'
// Let's try removing the extensions, and let the bundler resolve them.
import App from './App'
import './index.css' // .css is usually required
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

