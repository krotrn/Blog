import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import './components'
import { login, logout } from './store/authSlice'
import { Footer, Header, Loading } from './components'
import { Outlet } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData)
          dispatch(login({ userData }))
        else
          dispatch(logout());
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-[#232B42]'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <SpeedInsights />
    </div>
  ) : (
    <div className='flex bg-[#232B42] justify-center items-center min-h-screen'>
      <Loading />
      <SpeedInsights />
    </div>
  )
}

export default App
