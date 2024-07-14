import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false)
    const logoutHandler = () => {
        setLoading(true)
        authService.logout().then(() => {
            dispatch(logout());
            setLoading(false)
        })
    }
  return (
      <button
          className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full' onClick={logoutHandler}
      >{loading? 'Wait..' : 'Logout'}</button>
  )
}

export default LogoutBtn