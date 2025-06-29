"use server";

import { ID } from "node-appwrite";
import { mockDb } from "../mock.config";
import { parseStringify } from "../utils";

// Register a new user with mock database
export const registerUser = async (userData: {
  name: string;
  email: string;
  phone: string;
}) => {
  try {
    // Check if user already exists
    const existingUsers = await mockDb.listUsers([
      { equal: ['email', [userData.email]] }
    ]);

    if (existingUsers.users.length > 0) {
      return { 
        success: false, 
        error: 'User with this email already exists',
        user: existingUsers.users[0]
      };
    }

    // Create new user
    const newUser = await mockDb.createUser(userData);
    
    return { 
      success: true, 
      user: parseStringify(newUser),
      message: 'User registered successfully'
    };
  } catch (error) {
    console.error("An error occurred while registering user:", error);
    return { 
      success: false, 
      error: 'Failed to register user',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Register a new patient with mock database
export const registerPatient = async (patientData: {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}) => {
  try {
    // Check if patient already exists
    const existingPatients = await mockDb.listPatients([
      { equal: ['email', [patientData.email]] }
    ]);

    if (existingPatients.documents.length > 0) {
      return { 
        success: false, 
        error: 'Patient with this email already exists'
      };
    }

    // Handle file upload if provided
    let fileId: string | undefined = undefined;
    let fileUrl: string | undefined = undefined;
    
    if (patientData.identificationDocument) {
      const blobFile = patientData.identificationDocument.get("blobFile") as Blob;
      const fileName = patientData.identificationDocument.get("fileName") as string;
      
      if (blobFile && fileName) {
        const file = await mockDb.createFile('mock-bucket', ID.unique(), {
          name: fileName,
          size: blobFile.size,
          type: blobFile.type,
        });
        fileId = file.$id;
        fileUrl = `http://localhost:3000/storage/buckets/mock-bucket/files/${file.$id}/view?project=mock-project`;
      }
    }

    // Create new patient
    const newPatient = await mockDb.createPatient({
      userId: patientData.userId,
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone,
      birthDate: patientData.birthDate.toISOString(),
      gender: patientData.gender.toLowerCase() as 'male' | 'female' | 'other',
      address: patientData.address,
      occupation: patientData.occupation,
      emergencyContactName: patientData.emergencyContactName,
      emergencyContactNumber: patientData.emergencyContactNumber,
      primaryPhysician: patientData.primaryPhysician,
      insuranceProvider: patientData.insuranceProvider,
      insurancePolicyNumber: patientData.insurancePolicyNumber,
      allergies: patientData.allergies,
      currentMedication: patientData.currentMedication,
      familyMedicalHistory: patientData.familyMedicalHistory,
      pastMedicalHistory: patientData.pastMedicalHistory,
      identificationType: patientData.identificationType,
      identificationNumber: patientData.identificationNumber,
      identificationDocumentId: fileId,
      identificationDocumentUrl: fileUrl,
      privacyConsent: patientData.privacyConsent,
    });

    return { 
      success: true, 
      patient: parseStringify(newPatient),
      message: 'Patient registered successfully'
    };
  } catch (error) {
    console.error("An error occurred while registering patient:", error);
    return { 
      success: false, 
      error: 'Failed to register patient',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Complete registration flow - register user and patient in one call
export const completeRegistration = async (userData: {
  name: string;
  email: string;
  phone: string;
}, patientData: {
  birthDate: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}) => {
  try {
    // First register the user
    const userResult = await registerUser(userData);
    
    if (!userResult.success) {
      return userResult;
    }

    // Then register the patient
    const patientResult = await registerPatient({
      userId: userResult.user.$id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      ...patientData,
    });

    if (!patientResult.success) {
      return patientResult;
    }

    return {
      success: true,
      user: userResult.user,
      patient: patientResult.patient,
      message: 'Registration completed successfully'
    };
  } catch (error) {
    console.error("An error occurred during complete registration:", error);
    return { 
      success: false, 
      error: 'Failed to complete registration',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 