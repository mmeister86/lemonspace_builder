import { Client, Account } from "appwrite";

// AppWrite Client-Konfiguration
// Diese Werte sollten aus Umgebungsvariablen kommen
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);

