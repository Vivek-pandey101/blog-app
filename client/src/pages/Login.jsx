import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetState } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [animate, setAnimate] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(true);
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (user) {
      navigate("/create");
    }

    return () => {
      dispatch(resetState());
    };
  }, [user, dispatch, navigate]);

  useEffect(() => {
    // Animation delay
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          animate ? "scale-95 opacity-80" : "scale-100 opacity-100"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-100 mt-2">Sign in to continue to your blog</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-3 px-4 font-medium transition-all duration-300 ${
                loading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-center p-4 bg-red-50 text-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-6 flex items-center p-4 bg-green-50 text-green-800 rounded-lg">
              <Check className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
