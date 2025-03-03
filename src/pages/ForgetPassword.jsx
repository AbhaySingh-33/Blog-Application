import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/index.js';
import authService from '../appwrite/auth.js';

const ForgetPassword = () => {
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const send = async (data) => {
    setError("");

    try {
      const response = await authService.sendPasswordReset(data.email);
      console.log(response);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error in sending email:", error);
      setError(error.message);
      toast.error("Error in sending email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-5">Forgot Password?</h2>

        <form onSubmit={handleSubmit(send)} className="space-y-5">
          <div>
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
