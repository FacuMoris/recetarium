import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './custom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-lhvixnsa65hm0huw.us.auth0.com"
      clientId="e8w055dTbzBJbcBM8rahS4VCHS6oed6I"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https//recetarium-api",
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
