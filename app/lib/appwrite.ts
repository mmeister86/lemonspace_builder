import { Client, Account, Storage, Databases, ID } from "appwrite";

// AppWrite Client-Konfiguration
// Diese Werte sollten aus Umgebungsvariablen kommen
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

// Database und Collection IDs
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const BOARDS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BOARDS_COLLECTION_ID || "";

// Export ID für Verwendung in Services
export { ID };
