import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying...');
    const [error, setError] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            const userId = searchParams.get("userId");
            const secret = searchParams.get("secret");
            console.log("Extracted userId:", userId);
            console.log("Extracted secret:", secret);
 
               if (!userId || !secret) {
                 setError("Invalid password reset link! Please check your email.");
                 return;
               }
           
               // UUID format check (Appwrite uses 36-character user IDs)
               const uuidRegex = /^[a-f0-9]{20,36}$/i;  // Appwrite userId can be 20-36 characters long
               if (!uuidRegex.test(userId)) {
                 setError(`Invalid user ID format: ${userId}`);
               }
           
            
            console.log("checking")
            try {
                console.log("Sending userId:", userId);
                console.log("Sending secret:", secret);

                await authService.updateEmailVerification( userId, secret );
                setStatus("Email verified successfully! You can now log in.");
                toast.success("Email verified! Please log in.");
                setTimeout(() => navigate("/login"), 3000);
            } catch (error) {
                setStatus(error.message);
                toast.error("Verification failed or link expired.");
            }
        };
    
        verifyEmail();
    }, [searchParams, navigate]);
    
    

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded-md">
                <h1 className="text-lg font-semibold">{status}</h1>
            </div>
        </div>
    );
};

export default VerifyEmail;
