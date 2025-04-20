import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetState } from "../features/auth/authSlice";
import { Check, AlertCircle, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [animate, setAnimate] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(true);
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    // Animation delay
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          animate ? "scale-95 opacity-80" : "scale-100 opacity-100"
        }`}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 px-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-purple-100 mt-2">Join our blogging community</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 px-4 font-medium transition-all duration-300 ${
                loading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-1"
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
