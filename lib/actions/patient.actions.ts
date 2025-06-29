"use server";

import { ID, InputFile, Query } from "node-appwrite";

import {
  BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID,
  ENDPOINT,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_PROJECT_ID,
  databases,
  storage,
  users,
  mockDb,
} from "../mock.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET OR CREATE USER (for registration flow)
export const getOrCreateUser = async (user: CreateUserParams) => {
  try {
    // First, try to find existing user
    const usersList = await users.list([
      Query.equal("email", [user.email]),
    ]);

    let existingUser = usersList.users[0];

    if (existingUser) {
      // User exists, check if they have a patient profile
      const patient = await getPatient(existingUser.$id);
      
      if (patient) {
        // User has a patient profile, redirect to appointments
        return { user: parseStringify(existingUser), hasPatient: true };
      } else {
        // User exists but no patient profile, redirect to registration
        return { user: parseStringify(existingUser), hasPatient: false };
      }
    } else {
      // User doesn't exist, create new user
      const newUser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );
      
      return { user: parseStringify(newUser), hasPatient: false };
    }
  } catch (error) {
    console.error("An error occurred while getting or creating user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// LOGIN USER
export const loginUser = async (credentials: { email: string; phone: string }) => {
  try {
    const usersList = await users.list([
      Query.equal("email", [credentials.email]),
    ]);

    const user = usersList.users[0];

    if (user && user.phone === credentials.phone) {
      return parseStringify(user);
    }

    return null;
  } catch (error) {
    console.error("An error occurred during login:", error);
    return null;
  }
};

// REGISTER PATIENT WITH MOCK DATABASE
export const registerPatientWithMock = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Check if patient already exists
    const existingPatients = await mockDb.listPatients([
      { equal: ['email', [patient.email]] }
    ]);

    if (existingPatients.documents.length > 0) {
      throw new Error('Patient with this email already exists');
    }

    // Handle file upload if provided
    let fileId = null;
    let fileUrl = null;
    
    if (identificationDocument) {
      const blobFile = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;
      
      if (blobFile && fileName) {
        const file = await mockDb.createFile(BUCKET_ID!, ID.unique(), {
          name: fileName,
          size: blobFile.size,
          type: blobFile.type,
        });
        fileId = file.$id;
        fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`;
      }
    }

    // Create new patient document using mock database
    const newPatient = await mockDb.createPatient({
      userId: patient.userId,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthDate: patient.birthDate.toISOString(),
      gender: patient.gender.toLowerCase() as 'male' | 'female' | 'other',
      address: patient.address,
      occupation: patient.occupation,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactNumber: patient.emergencyContactNumber,
      primaryPhysician: patient.primaryPhysician,
      insuranceProvider: patient.insuranceProvider,
      insurancePolicyNumber: patient.insurancePolicyNumber,
      allergies: patient.allergies,
      currentMedication: patient.currentMedication,
      familyMedicalHistory: patient.familyMedicalHistory,
      pastMedicalHistory: patient.pastMedicalHistory,
      identificationType: patient.identificationType,
      identificationNumber: patient.identificationNumber,
      identificationDocumentId: fileId,
      identificationDocumentUrl: fileUrl,
      privacyConsent: patient.privacyConsent,
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};

// REGISTER PATIENT (updated to use mock database)
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${NEXT_PUBLIC_PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// GET PATIENT BY EMAIL (alternative method)
export const getPatientByEmail = async (email: string) => {
  try {
    const patients = await databases.listDocuments(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      [Query.equal("email", [email])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details by email:",
      error
    );
  }
};

// GET PATIENT WITH MOCK DATABASE
export const getPatientWithMock = async (userId: string) => {
  try {
    const patients = await mockDb.listPatients([
      { equal: ['userId', [userId]] }
    ]);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// GET PATIENT BY EMAIL WITH MOCK DATABASE
export const getPatientByEmailWithMock = async (email: string) => {
  try {
    const patients = await mockDb.listPatients([
      { equal: ['email', [email]] }
    ]);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details by email:",
      error
    );
  }
};
