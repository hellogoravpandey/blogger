import React from 'react'
import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom';

function Login() {
    console.log("inside the login");
  return (
    <main className='flex min-h-screen items-center justify-center px-4 '>
        <div className='w-full max-w-md p-3'>
          <h1 className='text-3xl font-bold text-gray-900 '>
            Welcome back
          </h1>
          <p className='mt-2 text-gray-600'>
            Sign in to continue to Blogify
          </p>
          <LoginForm/>

            <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-gray-900 underline"
                    >
                        Create a new account
                    </Link>
                </p>
        </div>
    </main>
  )
}

export default Login