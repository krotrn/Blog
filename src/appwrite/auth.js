import conf from '../conf/conf.js'
import { Client, Account, ID } from "appwrite";
/**
 * Service class for authentication-related operations.
 */
export class AuthService {
  client = new Client();
  account
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  /**
   * Creates a new user account and logs the user in.
   */
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        // call another methord
        return this.login({ email, password });

      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite service :: createAccount :: error", error);
      throw error;
    }
  }

  /**
   * Logs in a user with email and password.
   * The session object upon successful login.
   */

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  /**
   * Retrieves the current logged-in user's details.
   *  The current user's details or null if not available.
   */
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }
    return null;
  }

  /**
   * Logs out the current user by deleting all sessions.
   */

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}


const authService = new AuthService();

export default authService;
