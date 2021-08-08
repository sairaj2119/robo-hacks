import React from 'react'
import { useAuth } from '../authContext'
import { useRouter } from 'next/router'

const Login = () => {
  const { login, googleSignIn } = useAuth()
  const router = useRouter()
  // use nextjs useRouter hook

  const [values, setValues] = React.useState({
    email: '',
    password: '',
  })

  // onChange funtion for inputs

  const onChange = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (values.email && values.password) {
      try {
        await login(values.email, values.password)
        router.push('/stream')
      } catch (err) {
        console.log(err.code)
        console.log(err.message)
      }
    }
  }


  return (
    <>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input onChange={onChange} type="text" name="email" id="email" value={values.email} />
          <label htmlFor="passowrd">Password</label>
          <input
            onChange={onChange}
            type="password"
            id="password"
            name="password"
            value={values.password}
          />
          <button type="submit">Login</button>
        </form>
    
      </div>

      <style jsx>{`
        h1 {
          text-align: center;
        }

        form {
          margin: 3rem auto;
          width: 300px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          margin: 0.3rem 0 1rem 0;
        }
        button {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          margin-top: 1rem;
          cursor: pointer;
        }

        .google {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button#google {
          width: 300px;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

export default Login
