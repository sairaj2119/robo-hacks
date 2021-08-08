import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../authContext'

const RequiresNoAuth = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.back()
    }
  }, [])

  return <>{!isAuthenticated && children}</>
}

export default RequiresNoAuth
