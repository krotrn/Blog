import React, { useState, useMemo, useCallback } from 'react';
import { Container, Logo, LogoutBtn } from '../';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  console.log("Re-Render Header");

  const navItems = useMemo(() => [
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
  ], [authStatus]);

  const toggleMobile = useCallback(() => {
    setMobile((prevMobile) => !prevMobile);
  }, []);

  return (
    <header className='py-3 font-medium shadow text-[#988dcc] bg-[#0e062e] sticky'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo className='bg-cover min-w-12' />
            </Link>
          </div>
          <button
            className={`sm:hidden flex ml-auto`}
            onClick={toggleMobile}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png" alt="Menu" className='bg-cover w-[3rem]' />
          </button>
        
          <ul className={'hidden sm:flex ml-auto'} >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-[#032372] rounded-full'
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
        {mobile && (
            <ul className={`absolute z-30 right-0 mt-2 py-2 w-48 text-[#988dcc] bg-[#0e062e] rounded-lg shadow-xl transition-opacity duration-300 ease-in-out transform ${mobile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.slug)
                      setMobile(false)
                    }}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-[#032372] rounded-full'
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
        </nav>
      </Container>
    </header>
  )
}

export default React.memo(Header);