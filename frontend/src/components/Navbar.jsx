import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav className={`public-nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">C</div>
        <span>CollegeMS</span>
      </Link>
      <button type="button" className="nav-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open
            ? <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>
            : <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>
          }
        </svg>
      </button>
      <div className={`nav-links${open ? ' open' : ''}`}>
        <Link to="/" className={`nav-link${location.pathname === '/' ? ' active' : ''}`}>Home</Link>
        <Link to="/about" className={`nav-link${location.pathname === '/about' ? ' active' : ''}`}>About</Link>
        <Link to="/login" className="nav-link-cta">Sign In</Link>
      </div>
    </nav>
  );
}
