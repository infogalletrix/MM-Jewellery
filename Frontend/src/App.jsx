import { useState, useEffect } from 'react'
import Home from './components/Home'
import Catalogue from './components/Catalogue'
import Collections from './components/Collections'
import Offers from './components/Offers'
import Gallery from './components/Gallery'
import About from './components/About'
import Contact from './components/Contact'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem('admin_is_logged_in') === 'true'
  )

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const path = window.location.pathname

      if (path === '/admin') {
        // If there's a hash action, redirect to home page with that hash
        if (hash && hash !== '#') {
          window.location.href = '/' + hash
          return
        }
        
        const loggedIn = localStorage.getItem('admin_is_logged_in') === 'true'
        setIsAdminLoggedIn(loggedIn)
        if (loggedIn) {
          setCurrentPage('admin-dashboard')
        } else {
          setCurrentPage('admin-login')
        }
        return
      }

      // Public site routing
      if (hash.startsWith('#collections/')) {
        const collectionId = parseInt(hash.split('/')[1]);
        const collectionNames = {
          1: "Bridal Collection",
          2: "Wedding Collection",
          3: "Traditional Collection",
          4: "Modern Collection",
          5: "Party Wear Collection",
          6: "Festival Collections"
        };
        const collectionName = collectionNames[collectionId];
        if (collectionName) {
          window.location.hash = `#catalogue?collection=${encodeURIComponent(collectionName)}`;
          return;
        }
      }

      if (hash.startsWith('#catalogue')) {
        setCurrentPage('catalogue')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('#collections')) {
        setCurrentPage('collections')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('#offers')) {
        setCurrentPage('offers')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('#gallery')) {
        setCurrentPage('gallery')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('#about')) {
        setCurrentPage('about')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('#contact')) {
        setCurrentPage('contact')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setCurrentPage('home')
        // Scroll to the targeted section on Home page after brief render timeout
        if (hash && hash !== '#') {
          setTimeout(() => {
            const element = document.getElementById(hash.substring(1))
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    // Initial run on mount
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    setCurrentPage('admin-dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_is_logged_in')
    localStorage.removeItem('admin_username')
    setIsAdminLoggedIn(false)
    window.location.href = '/'
  }

  if (currentPage === 'admin-login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />
  }

  if (currentPage === 'catalogue') {
    return <Catalogue />
  }

  if (currentPage === 'collections') {
    return <Collections />
  }

  if (currentPage === 'offers') {
    return <Offers />
  }

  if (currentPage === 'gallery') {
    return <Gallery />
  }

  if (currentPage === 'about') {
    return <About />
  }

  if (currentPage === 'contact') {
    return <Contact />
  }

  return <Home />
}

export default App
