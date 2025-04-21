import React, { useState } from 'react';
import authService from '../appwrite/auth';
import databaseService from '../appwrite/database'; // Correct Import
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from './index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const signup = async (data) => {
        try {
            const user = await authService.createAccount(data);
    
            if (user) {
                const authUser = await authService.getCurrentUser(); // ✅ Ensure correct user ID
    
                if (!authUser || !authUser.$id) {
                    throw new Error("User data is not available");
                }
    
                await databaseService.createUserDocument(authUser.$id, data.name, data.email);
                
                await authService.emailVerification();
                toast.success("Verification email sent to your mail");
    
                await authService.logout();
                toast.error("Please verify your email before logging in.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.message || "Error in registration");
        }
    };
    
    

    return (
        <div className="flex items-center justify-center text-white">
            <div className="mx-auto w-full max-w-lg backdrop-blur-md rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-blue-300">
                    Already have an account?&nbsp;
                    <Link to="/login" className="font-medium text-blue-600 transition-all duration-200 hover:underline">
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(signup)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", { required: true })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
