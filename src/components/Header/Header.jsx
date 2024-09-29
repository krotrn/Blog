import { useState, useMemo, useCallback, lazy, Suspense, memo } from 'react';
import { Container, Loading, LogoutBtn } from '../';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

// Lazy load Logo for performance optimization
const Logo = lazy(() => import('../Logo'));

function Header() {
  // Get authentication status from the Redux store
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);

  // Memoize navigation items to avoid re-creating on every render
  const navItems = useMemo(() => [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ], [authStatus]);

  // Memoize toggleMobile function to prevent unnecessary re-renders
  const toggleMobile = useCallback(() => {
    setMobile((prevMobile) => !prevMobile);
  }, []);

  return (
    <header className="py-3 font-medium shadow text-[#988dcc] bg-[#0e062e] sticky">
      <Container>
        <nav className="flex" role="navigation" aria-label="Main navigation">
          {/* Lazy-load the Logo component */}
          <Suspense fallback={<Loading />}>
            <div className="mr-4">
              <Link to="/">
                <Logo className="bg-cover min-w-12" />
              </Link>
            </div>
          </Suspense>

          {/* Mobile menu toggle button */}
          <button
            aria-label="Toggle mobile menu"
            className="sm:hidden flex ml-auto"
            onClick={toggleMobile}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png"
              alt="Menu"
              className="bg-cover w-[3rem]"
            />
          </button>

          {/* Desktop navigation menu */}
          <ul className="hidden sm:flex ml-auto">
            {navItems.map((item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="inline-block px-6 py-2 duration-200 hover:bg-[#032372] rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile dropdown menu */}
          {mobile && (
            <ul
              className={classnames(
                "absolute z-30 right-0 mt-2 py-2 w-48 text-[#988dcc] bg-[#0e062e] rounded-lg shadow-xl transition-opacity duration-300 ease-in-out transform",
                {
                  "opacity-100 translate-y-0": mobile,
                  "opacity-0 -translate-y-2": !mobile,
                }
              )}
            >
              {navItems.map((item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setMobile(false); // Close mobile menu on navigation
                      }}
                      className="inline-block px-6 py-2 duration-200 hover:bg-[#032372] rounded-full"
                    >
                      {item.name}
                    </button>
                  </li>
                )
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
  );
}

export default memo(Header); // Memoize the Header component for performance
