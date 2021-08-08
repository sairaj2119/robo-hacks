import React from 'react'
import Link from 'next/link'
import { useAuth } from '../authContext'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div>
      <ul>
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </>
        )}
      </ul>

      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          justify-content: center;
        }
        ul li {
          margin-right: 1rem;
        }
      `}</style>
    </div>
  )
}

export default Navbar
