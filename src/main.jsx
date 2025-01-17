import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { Router } from './routing/Router'
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
