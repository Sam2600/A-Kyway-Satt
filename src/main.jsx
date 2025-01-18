import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { Router } from './routing/Router'
import { RouterProvider } from "react-router-dom";
import { store } from './states/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  </StrictMode>,
)
