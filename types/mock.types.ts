// Mock types that are compatible with Appwrite types
export interface MockDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId?: string;
  $databaseId?: string;
  $permissions?: string[];
}

export interface MockPatient extends MockDocument {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
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
  identificationDocumentId?: string;
  identificationDocumentUrl?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}

export interface MockAppointment extends MockDocument {
  patient: MockPatient;
  schedule: string;
  status: 'pending' | 'scheduled' | 'cancelled';
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
}

export interface MockUser extends MockDocument {
  name: string;
  email: string;
  phone: string;
}

// Type aliases for compatibility
export type Patient = MockPatient;
export type Appointment = MockAppointment;
export type User = MockUser;

// Status type
export type Status = 'pending' | 'scheduled' | 'cancelled';
export type Gender = 'male' | 'female' | 'other';

// Form parameter types
export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}

export interface RegisterUserParams {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
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
}

export interface CreateAppointmentParams {
  patient: MockPatient;
  schedule: string;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
} 