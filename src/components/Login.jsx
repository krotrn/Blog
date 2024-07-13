// Importing necessary modules and components from React, React Router, Redux, and custom components
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { Button, Input, Logo } from './index'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'


function Login() {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { register, handleSubmit } = useForm()
    
    const [error, setError] = React.useState(null)

    
    const login = async (data) => {
        setError(null) 
        try {
            
            
            const session = await authService.login(data);
            if (session) {
                
                const userData = await authService.getCurrentUser()
                if (userData) {
                    
                    dispatch(authLogin(userData))
                }
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    // Render method for the Login component
    return (
        <div
            className='flex items-center justify-center w-full my-8'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" /> 
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>

                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up 
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>} 
                
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: "Email is required", 
                                pattern: { 
                                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
                                  message: "Email address must be a valid address", 
                                }
                              })}
                        />
                        <Input
                            label='Password'
                            placeholder='Enter your password'
                            type='password'
                            {...register('password', {
                                required: 'Password is required' 
                            })}
                        />

                        <Button
                            type='submit'
                            className='w-full'
                        >Sign In</Button> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login 