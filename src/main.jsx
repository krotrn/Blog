import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.js';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import AuthLayout from './components/AuthLayout';
import Loading from './components/Loading.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const AllPosts = lazy(() => import('./pages/AllPosts.jsx'));
const AddPost = lazy(() => import('./pages/AddPost.jsx'));
const EditPost = lazy(() => import('./pages/EditPost.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Login = lazy(() => import('./components/Login.jsx'));

const ErrorBoundary = ({ children }) => (
  <Suspense fallback={<div className='flex bg-[#232B42] justify-center items-center min-h-screen'>
    <Loading />
  </div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication={false}>
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <ErrorBoundary>
              <Signup />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            <ErrorBoundary>
              <AllPosts />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            <ErrorBoundary>
              <AddPost />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <ErrorBoundary>
              <EditPost />
            </ErrorBoundary>
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <ErrorBoundary>
            <Post />
          </ErrorBoundary>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
