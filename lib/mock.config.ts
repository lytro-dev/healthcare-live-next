import { mockDb } from './mock-db';

// Mock configuration that mimics Appwrite's interface
export const databases = {
  createDocument: async (databaseId: string, collectionId: string, documentId: string, data: any) => {
    if (collectionId.includes('patient')) {
      return await mockDb.createPatient(data);
    } else if (collectionId.includes('appointment')) {
      return await mockDb.createAppointment(data);
    }
    throw new Error(`Unknown collection: ${collectionId}`);
  },

  listDocuments: async (databaseId: string, collectionId: string, queries: any[] = []) => {
    if (collectionId.includes('patient')) {
      return await mockDb.listPatients(queries);
    } else if (collectionId.includes('appointment')) {
      return await mockDb.listAppointments(queries);
    }
    throw new Error(`Unknown collection: ${collectionId}`);
  },

  getDocument: async (databaseId: string, collectionId: string, documentId: string) => {
    if (collectionId.includes('patient')) {
      return await mockDb.getPatient(documentId);
    } else if (collectionId.includes('appointment')) {
      return await mockDb.getAppointment(documentId);
    }
    throw new Error(`Unknown collection: ${collectionId}`);
  },

  updateDocument: async (databaseId: string, collectionId: string, documentId: string, data: any) => {
    if (collectionId.includes('patient')) {
      return await mockDb.updatePatient(documentId, data);
    } else if (collectionId.includes('appointment')) {
      return await mockDb.updateAppointment(documentId, data);
    }
    throw new Error(`Unknown collection: ${collectionId}`);
  },
};

export const users = {
  create: async (userId: string, email: string, phone: string, password: string | undefined, name: string) => {
    return await mockDb.createUser({ name, email, phone });
  },

  get: async (userId: string) => {
    return await mockDb.getUser(userId);
  },

  list: async (queries: any[] = []) => {
    return await mockDb.listUsers(queries);
  },
};

export const storage = {
  createFile: async (bucketId: string, fileId: string, file: any) => {
    return await mockDb.createFile(bucketId, fileId, file);
  },
};

export const messaging = {
  createSms: async (messageId: string, content: string, topics: string[], users: string[]) => {
    return await mockDb.createSms(messageId, content, topics, users);
  },
};

// Mock environment variables
export const NEXT_PUBLIC_ENDPOINT = 'http://localhost:3000';
export const NEXT_PUBLIC_PROJECT_ID = 'mock-project';
export const NEXT_PUBLIC_API_KEY = 'mock-api-key';
export const NEXT_PUBLIC_DATABASE_ID = 'mock-database';
export const NEXT_PUBLIC_PATIENT_COLLECTION_ID = 'patient';
export const NEXT_PUBLIC_DOCTOR_COLLECTION_ID = 'doctor';
export const NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID = 'appointment';
export const NEXT_PUBLIC_BUCKET_ID = 'mock-bucket';
export const BUCKET_ID = 'mock-bucket';
export const ENDPOINT = 'http://localhost:3000'; 