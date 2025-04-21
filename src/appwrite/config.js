import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query ,Permission, Role} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getLikedPosts (userId) {
        try {
        const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId, 
            [
                Query.equal("likes", userId) 
            ]
        );
        return response.documents;
        } catch (error) {
        console.error("Error fetching liked posts:", error);
        return [];
        }
    }

    async getDislikedPosts (userId) {
        try {
        const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId, 
            [
                Query.equal("dislikes", userId) 
            ]
        );
        return response.documents;
        } catch (error) {
        console.error("Error fetching disliked posts:", error);
        return [];
        }
    }
 

    async updatePostLikeDislike (postId, data) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                data
            );
        } catch (error) {
            console.error("Error updating post:", error);
            return null;
        }
    };

    async createPost({title, slug, content, featuredimage, status, userid}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredimage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            if (!file) {
                throw new Error("No file provided for upload");
            }
    
            const uploadedFile = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            );
    
            console.log("File uploaded successfully:", uploadedFile);
            return uploadedFile;
        } catch (error) {
            console.error(" Appwrite Service :: uploadFile :: error", error);
            return null; 
        }
    }
    
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        if (!fileId) {
            console.error(" Error: Missing fileId for preview");
            return "/default-placeholder.png"; // Use a default image
        }
        console.log(this.bucket.getFilePreview(conf.appwriteBucketId, fileId));

        return this.bucket.getFileDownload(conf.appwriteBucketId, fileId);
    }
    
}


const service = new Service()
export default service