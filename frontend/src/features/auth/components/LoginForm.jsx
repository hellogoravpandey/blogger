import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {
  const { login, clearLoginError, loginLoading, loginError } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const handleChange = (e) => {
    // console.log(typeof e.target); //obj
    const {name, value} = e.target;
    setFormData({
        ...formData,
        [name]: value
    });

    // set error("") when user starts writing
    if(loginError){
        clearLoginError();
    }

  };

  const handleSubmit = async (e) => {
    //  try catch
    e.preventDefault();
    try {
      setSuccessMessage("");
      clearLoginError();
      await login(formData);
      setSuccessMessage("login successfully  redirecting.....");
      await new Promise(resolve => {
        setTimeout(resolve, 3000);
    });
    } catch (error) {
        // do nothing
    } 
  };

  return (
    <form  className="space-y-5 "  onSubmit={handleSubmit}>
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
      {loginError?(
        <p className="text-sm text-red-600">{loginError}</p>
      ): successMessage? (
         <p className="text-sm text-green-600">{successMessage}</p>
      ):null}

      {/* Submit */}
      <button
        type="submit"
        disabled={loginLoading}
        className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loginLoading ? "Signing in..." : "Sign in"}
      </button>

    </form>
  );
}

export default LoginForm;


