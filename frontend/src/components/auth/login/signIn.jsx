import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../context/authContext';
import bgImage from '../../../assets/logo.jpg';
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

const SignIn = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    setErrorMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        let message = 'An error occurred. Please try again.';
        if (error.code === 'auth/invalid-credential') {
          message = 'Invalid password or email.';
        }
        setErrorMessage(message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-neutral-100">
      {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}

      {/* Background Image */}
      <img
        src={bgImage}
        alt="Biketopia Logo"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* Login Form Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-zinc-900 bg-opacity-95 rounded-xl shadow-lg p-9 lg:w-1/3 md:w-1/2 w-11/12">
          <h1 className="text-neutral-100 text-3xl font-semibold mb-4 text-center">Login</h1>
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-neutral-100">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-400"
                autoComplete="email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-neutral-100">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:border-blue-400"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white text-lg rounded-lg ${isSigningIn ? 'bg-zinc-700 cursor-not-allowed' : 'bg-zinc-600 hover:bg-zinc-700 hover:shadow-xl transition duration-300'}`}
            >
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
