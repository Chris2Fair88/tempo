import { Link } from 'react-router-dom'

/**
 * Site Navigation Component
 * 
 * LOGIC: Provides main navigation links for the application
 * This was referenced in App.jsx but missing from the components
 */
const SiteNav = () => {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="container">
        <ul className="site-nav__list">
          <li className="site-nav__item">
            <Link to="/" className="site-nav__link">Home</Link>
          </li>
          <li className="site-nav__item">
            <Link to="/teacher" className="site-nav__link">For Teachers</Link>
          </li>
          <li className="site-nav__item">
            <Link to="/student" className="site-nav__link">For Students</Link>
          </li>
          <li className="site-nav__item">
            <Link to="/login" className="site-nav__link">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default SiteNav
