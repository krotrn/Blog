import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    }
  ]

  return (
    <header className='py-3 font-medium shadow bg-[#b8b9be] sticky'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo className='bg-cover min-w-12' />
            </Link>
          </div>
          <button
            className={`sm:hidden flex ml-auto`}
            onClick={() => {
              setIsDropdownVisible(!isDropdownVisible)
            }}
          >
            <img src="/src/assets/menu.webp" alt="Menu" width={'48px'} />
          </button>
        
          <ul className={'hidden sm:flex ml-auto'} >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
        {isDropdownVisible && (
            <ul className={`absolute z-30 right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl`} >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            </ul>
          )}
      </Container>
    </header>
  )
}

export default Header