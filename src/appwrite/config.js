import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

// Defines a Service class for interacting with Appwrite services
export class Service {
    client = new Client(); // Appwrite client instance
    databases; // Appwrite databases instance
    bucket; // Appwrite storage instance

    // Constructor initializes Appwrite client, databases, and storage instances
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Sets the Appwrite API endpoint
            .setProject(conf.appwriteProjectId); // Sets the Appwrite project ID
        this.databases = new Databases(this.client); // Initializes the databases instance
        this.bucket = new Storage(this.client); // Initializes the storage instance
    }

    // Creates a new post document in the Appwrite database
    async createPost({
        title,
        slug,
        content,
        featuredImage,
        status,
        userId
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                });
        } catch (error) {
            console.log("Appwrite service :: createPost :: error");
        }
    }

    // Updates an existing post document in the Appwrite database
    async updatePost(slug,
        {
            title,
            content,
            featuredImage,
            status
        }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                });
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error");
        }
    }

    // Deletes a post document from the Appwrite database
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error");
            return false;
        }
    }

    // Retrieves a single post document from the Appwrite database
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error");
        }
    }

    // Retrieves a list of post documents from the Appwrite database based on a query
    async getPosts(query = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, query);
        } catch (error) {
            console.log("Appwrite service :: getPost :: error");
        }
    }

    // Uploads a file to the Appwrite storage
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error");
            return false;
        }
    }

    // Deletes a file from the Appwrite storage
    async deleteFile(fileId) {
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error");
            return false;
        }
    }

    // Retrieves a preview of a file from the Appwrite storage
    getFilePreview(fileId) {
        return  this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId,
        );
    }
}

// Initializes the Service class and exports it for use elsewhere
const service = new Service();
export default service;