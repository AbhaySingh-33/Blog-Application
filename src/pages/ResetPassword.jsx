import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../appwrite/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Use useSearchParams()
  
  // Extract userId and secret from query params
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  console.log("Extracted userId:", userId);
  console.log("Extracted secret:", secret);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid password reset link! Please check your email.");
      return;
    }

    // UUID format check (Appwrite uses 36-character user IDs)
    const uuidRegex = /^[a-f0-9]{20,36}$/i;  // Appwrite userId can be 20-36 characters long
    if (!uuidRegex.test(userId)) {
      setError(`Invalid user ID format: ${userId}`);
    }
  }, [userId, secret]);

  const handleResetPassword = async () => {
    if (error) {
      alert(error);
      navigate("/");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      console.log("Sending userId:", userId);
      console.log("Sending secret:", secret);

      await authService.recoveryAccount(userId, secret, password);

      alert("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(`Failed to reset password: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={!password || !confirmPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
