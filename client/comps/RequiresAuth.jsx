import React, { useEffect } from 'react'
import { useAuth } from '../authContext'
import {useRouter} from 'next/router'

const RequiresAuth = ({ children }) => {
  const { isAuthenticated } = useAuth()
	const router = useRouter()
	useEffect(() => {
		if(!isAuthenticated){
				router.push('/login')
		}
	}, [])
	

  return <>{isAuthenticated && children}</>
}

export default RequiresAuth
