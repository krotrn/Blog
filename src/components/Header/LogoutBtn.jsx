import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import {Loading} from '../index.js';
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false)
    const logoutHandler = () => {
        setLoading(true)
        authService.logout().then(() => {
            dispatch(logout());
            setLoading(false);
            navigate('/login')
        })
    }
    return (
        <button
            className='inline-bock px-6 py-2 duration-200 hover:bg-[#032372] rounded-full' onClick={logoutHandler}
        >{loading ? <Loading className='text-center' color='white' /> : 'Logout'}</button>
    )
}

export default LogoutBtn;