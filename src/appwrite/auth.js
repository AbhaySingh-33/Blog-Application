import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }
    async sendPasswordReset(email) {
        try {
            return await this.account.createRecovery(
                email,
                `http://localhost:5173/reset-password` 
            );
        } catch (error) {
            console.error("Error sending password reset:", error.message);
        }
    }
    
   

    async recoveryAccount(userId, secret, password) {
        try {
            console.log(`Attempting password reset for userId: ${userId}, secret: ${secret}`);
            
            return await this.account.updateRecovery(userId, secret, password, password);
        } catch (error) {
            console.error("Error resetting password:", error.message);
            throw error;
        }
    }
    
    

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async emailVerification() {
        try {
            const response = await this.account.createVerification(`${window.location.origin}/verify`);
                return response
            } 
           
         catch (error) {
            throw error;
        }
    }

    async updateEmailVerification( userId, secret ) {
        if (!userId || !secret) {
            throw new Error("Missing required parameters: 'userId' or 'secret'");
        }
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            throw error;
        }
    }
    

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const userData = await this.account.get();
            return userData;
        } catch (error) {
            if (error.code === 401) {
                console.log("User is not authenticated. Please log in.");
            } else {
                console.log("Appwrite service :: getCurrentUser :: error", error);
            }
        }
    
        return null;
    }

    async loginWithOAuth(provider) {
        try {
          await this.account.createOAuth2Session(provider, "http://localhost:5173");
        } catch (error) {
          console.error("OAuth Login Error:", error);
        }
      }

       logout = async () => {
        try {
            const session = await this.account.get(); // Check if a session exists
            if (session) {
                await this.account.deleteSession("current"); // Logout only if session exists
                console.log("User logged out successfully");
            }
        } catch (error) {
            if (error.code === 401) {
                // Don't show an error, just skip logout
            } else {
                console.error("Logout error:", error);
            }
        }
    };
    
    
    
}

const authService = new AuthService();

export default authService

