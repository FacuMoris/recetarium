import { useState } from 'react'
import TopNav from './components/TopNav'
import InfoCard from './components/InfoCard'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import About from './pages/About';
import Forum from './pages/Foro';
import Home from './pages/Home';

function App() {
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

  )
}

export default App
