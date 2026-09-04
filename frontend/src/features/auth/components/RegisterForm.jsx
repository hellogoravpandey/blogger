import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const {register, clearRegisterError, registerLoading, registerError} = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
    // if(error){

    // }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        await register(formData);
        // we need to navigate to the /login
        successMessage("account created successfully  redirecting ..... ")
        await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
        navigate("/login");
    } catch (error) {

    }
  }
  return (
    <form  className="space-y-5" onSubmit={handleSubmit}>
     {/* username */}
     <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        transition
                        focus:border-gray-900
                        focus:ring-1
                        focus:ring-gray-900
                    "
          placeholder="your username.."
        />
     </div>
    
      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
          className=" w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition  focus:border-gray-900 focus:ring-1 focus:ring-gray-900
                    "
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        transition
                        focus:border-gray-900
                        focus:ring-1
                        focus:ring-gray-900
                    "
          placeholder="••••••••"
        />
      </div>

      {/* Error */}
      {registerError?(
        <p className="text-sm text-red-600">{registerError}</p>
      ): successMessage? (
         <p className="text-sm text-red-600">{successMessage}</p>
      ):null}

      {/* Submit */}
      <button
        type="submit"
        disabled={registerLoading}
        className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {registerLoading ? "creating account..." : "Create Account"}
      </button>
    </form>
  )
}

export default RegisterForm