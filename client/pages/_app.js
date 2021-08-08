import { AuthContextProvider } from '../authContext'
import Navbar from '../comps/Navbar'
import { useRouter } from 'next/router'
import RequiresAuth from '../comps/RequiresAuth'
import RequiresNoAuth from '../comps/RequiresNoAuth'
import 'bootstrap/dist/css/bootstrap.min.css'

const noAuthRequiredPages = ['/', '/login']

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  console.log(router.pathname)
  return (
    <AuthContextProvider>
      <Navbar />
      {noAuthRequiredPages.includes(router.pathname) ? (
        <RequiresNoAuth>
          <Component {...pageProps} />
        </RequiresNoAuth>
      ) : (
        <RequiresAuth>
          <Component {...pageProps} />
        </RequiresAuth>
      )}
    </AuthContextProvider>
  )
}

export default MyApp
