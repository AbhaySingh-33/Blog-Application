import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';



function App() {

  const bgStyle = {
    backgroundImage: `url('/src/assets/bg2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

  };

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
        console.log(userData.$id)
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  
  return !loading ? (
    <div className='min-h-screen flex flex-col '>
      <Toaster />
      <Header />
      <main className='flex-grow bg-amber-50'>
         <div style={bgStyle}>
         <Outlet />
         </div>
      </main>
      <Footer/>
    </div>
  ) : null
}

export default App