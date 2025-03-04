import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');

    const login = async (data) => {
        setError('');
        try {
            const session = await authService.login(data);

            if (session) {
                const userData = await authService.getCurrentUser ();

                if (!userData.emailVerification) { 
                    toast.error('Please verify your email before logging in.');
                    await authService.logout(); // Logout to prevent access
                    return;
                }

                toast.success('Login successful');
                dispatch(authLogin(userData));
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Error in login');
            toast.error(error.message || 'Error in login');
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have an account?&nbsp;
                    <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
                        Sign Up
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        'Please enter a valid email address',
                                },
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', { required: 'Password is required' })}
                        />

                        <p>
                            Don't remember your password?{' '}
                            <Link className="text-red-600 mt-8 mx-2 text-center" to="/forget-password">
                                Forgot Password
                            </Link>
                        </p>

                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>

                        {/* GitHub OAuth Login */}
                        <div className="flex items-center justify-center bg-gray-100">
                            <div className="bg-white p-6 mt-14 rounded-lg shadow-md text-center">
                                <h2 className="text-2xl font-bold mb-4">Login</h2>

                                <button
                                    onClick={() => authService.loginWithOAuth('github')}
                                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-md"
                                >
                                    Login with GitHub
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;