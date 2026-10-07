import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Header/>
    <Login/>
   <Footer/>
  </StrictMode>,
)
