import { createContext, useContext, useEffect, useState } from 'react'
import firebase from './firebaseConfig'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const formatUser = (user, idToken) => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    idToken,
  }
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        user.getIdToken().then((idToken) => {
          setUser(formatUser(user, idToken))
        })
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  const logout = async () => {
    await firebase.auth().signOut()
    setUser(null)
  }

  const returnObj = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  }

  return <AuthContext.Provider value={returnObj}>{!loading && children}</AuthContext.Provider>
}
