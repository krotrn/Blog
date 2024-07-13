// Import necessary hooks and functions from React, Redux, and React Router DOM
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

// Define a Protected component that wraps any children components to control access based on authentication status
export default function Protected({ children, authentication = true }) {
    
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();
    // State to control the display of a loader
    const [loader, setLoader] = React.useState(false);
    // Access the authentication status from the Redux store
    const authStatus = useSelector(state => state.auth.status);

    // Effect hook to redirect users based on their authentication status
    useEffect(() => {
        // If the component is meant for authenticated users and the user is not authenticated, redirect to login
        if(authentication && authStatus !== authentication) {
            navigate('/login')
        } 
        // If the component is meant for unauthenticated users and the user is authenticated, redirect to home
        
        else if(!authentication && authStatus !== authentication) {
            navigate('/')
        }
        setLoader(false);

    // Dependency array to re-run the effect when any of these values change
    },[authStatus, navigate, authentication])

  // Render a loader if loading, otherwise render the children components
  return loader ? <div>Loading...</div> : <>{children}</>;
}