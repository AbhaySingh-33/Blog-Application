import { Client, Databases, ID } from 'appwrite';
import conf from '../conf/conf.js';

const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

const databaseService = {  
    createUserDocument: async (userId, name, email) => {
        try {
            return await databases.createDocument(
                conf.appwriteDatabaseId,  // Database ID
                conf.usersCollectionId,   // Collection ID
                userId,  // Use userId as document ID
                { userId, name, email }  // Ensure userId is included
            );
        } catch (error) {
            console.error('Error creating user document:', error);
            throw error;
        }
    },

    getUserData: async (userId) => {
        try {
            const user = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.usersCollectionId,
                userId
            );
            return user;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

};

export default databaseService;  // Now export correctly
