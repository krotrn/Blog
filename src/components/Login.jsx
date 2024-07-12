// Importing necessary modules and components from React, React Router, Redux, and custom components
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { Button, Input, Logo } from './index'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'

// Login component definition
function Login() {
    // Hooks for navigation and dispatch actions
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // useForm hook for handling form submission
    const { register, handleSubmit } = useForm()
    // Local state for handling errors
    const [error, setError] = React.useState(null)

    // Async function to handle login logic
    const login = async (data) => {
        console.log(data);
        setError(null) // Resetting error state
        try {
            // Attempting to log in with provided credentials
            const session = await authService.login(data.email, data.password);
            if (session) {
                // If login is successful, fetch user data
                const userData = await authService.getUserData()
                if (userData) {
                    // Dispatch login action with fetched user data and navigate to home page
                    dispatch(authLogin(userData))
                    navigate('/')
                }
            }
        } catch (error) {
            // Set error state if login fails
            setError(error.message)
        }
    }

    // Render method for the Login component
    return (
        <div
            className='flex items-center justify-center w-full'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" /> {/* Logo component */}
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>

                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up {/* Link to the signup page */}
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>} {/* Display error message if any */}
                {/* Login form */}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address", // Email validation
                                }
                            })}
                        />
                        <Input
                            label='password'
                            placeholder='Enter your password'
                            type='password'
                            {...register('password', {
                                required: 'Password is required' // Password validation
                            })}
                        />

                        <Button
                            type='submit'
                            className='w-full'
                        >Sign In</Button> {/* Submit button */}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login // Exporting the Login component