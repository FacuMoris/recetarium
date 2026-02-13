import { useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react"

import TopNav from './components/TopNav'
import InfoCard from './components/InfoCard'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import About from './pages/About';
import Forum from './pages/Foro';
import Home from './pages/Home';

function App() {

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div style={{ padding: 20 }}>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Login</button>
      ) : (
        <>
          <div>Hola, {user?.email || user?.name}</div>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
          </button>
        </>
      )}
    </div>
  );


  /*  
    const [count, setCount] = useState(0)
  
   return (
      <>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/foro" element={<Forum />} />
        </Routes>
        <Footer />
      </>
  
    ) */
}

export default App
