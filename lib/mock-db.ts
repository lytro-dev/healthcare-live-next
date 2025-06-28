import { v4 as uuidv4 } from 'uuid';

// Types
export interface MockPatient {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
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
  privacyConsent: boolean;
}

export interface MockAppointment {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  patient: MockPatient;
  schedule: string;
  status: 'pending' | 'scheduled' | 'cancelled';
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
}

export interface MockUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  phone: string;
}

// In-memory storage
let patients: MockPatient[] = [];
let appointments: MockAppointment[] = [];
let users: MockUser[] = [];

// Helper functions
const generateId = () => uuidv4();
const getCurrentTimestamp = () => new Date().toISOString();

// Mock database class
export class MockDatabase {
  // User operations
  async createUser(userData: { name: string; email: string; phone: string }) {
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return existingUser;
    }

    const newUser: MockUser = {
      $id: generateId(),
      $createdAt: getCurrentTimestamp(),
      $updatedAt: getCurrentTimestamp(),
      ...userData,
    };

    users.push(newUser);
    return newUser;
  }

  async getUser(userId: string) {
    return users.find(user => user.$id === userId);
  }

  async listUsers(queries: any[] = []) {
    let filteredUsers = [...users];
    
    // Handle queries (simplified)
    for (const query of queries) {
      if (query.equal && query.equal[0] === 'email') {
        filteredUsers = filteredUsers.filter(user => 
          user.email === query.equal[1][0]
        );
      }
    }

    return {
      users: filteredUsers,
      total: filteredUsers.length,
    };
  }

  // Patient operations
  async createPatient(patientData: Omit<MockPatient, '$id' | '$createdAt' | '$updatedAt'>) {
    const newPatient: MockPatient = {
      $id: generateId(),
      $createdAt: getCurrentTimestamp(),
      $updatedAt: getCurrentTimestamp(),
      ...patientData,
    };

    patients.push(newPatient);
    return newPatient;
  }

  async getPatient(patientId: string) {
    return patients.find(patient => patient.$id === patientId);
  }

  async listPatients(queries: any[] = []) {
    let filteredPatients = [...patients];
    
    // Handle queries (simplified)
    for (const query of queries) {
      if (query.equal && query.equal[0] === 'userId') {
        filteredPatients = filteredPatients.filter(patient => 
          patient.userId === query.equal[1][0]
        );
      }
      if (query.equal && query.equal[0] === 'email') {
        filteredPatients = filteredPatients.filter(patient => 
          patient.email === query.equal[1][0]
        );
      }
    }

    return {
      documents: filteredPatients,
      total: filteredPatients.length,
    };
  }

  async updatePatient(patientId: string, updateData: Partial<MockPatient>) {
    const index = patients.findIndex(patient => patient.$id === patientId);
    if (index === -1) throw new Error('Patient not found');

    patients[index] = {
      ...patients[index],
      ...updateData,
      $updatedAt: getCurrentTimestamp(),
    };

    return patients[index];
  }

  // Appointment operations
  async createAppointment(appointmentData: Omit<MockAppointment, '$id' | '$createdAt' | '$updatedAt'>) {
    const newAppointment: MockAppointment = {
      $id: generateId(),
      $createdAt: getCurrentTimestamp(),
      $updatedAt: getCurrentTimestamp(),
      ...appointmentData,
    };

    appointments.push(newAppointment);
    return newAppointment;
  }

  async getAppointment(appointmentId: string) {
    return appointments.find(appointment => appointment.$id === appointmentId);
  }

  async listAppointments(queries: any[] = []) {
    let filteredAppointments = [...appointments];
    
    // Handle queries (simplified)
    for (const query of queries) {
      if (query.orderDesc && query.orderDesc === '$createdAt') {
        filteredAppointments.sort((a, b) => 
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );
      }
    }

    return {
      documents: filteredAppointments,
      total: filteredAppointments.length,
    };
  }

  async updateAppointment(appointmentId: string, updateData: Partial<MockAppointment>) {
    const index = appointments.findIndex(appointment => appointment.$id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    appointments[index] = {
      ...appointments[index],
      ...updateData,
      $updatedAt: getCurrentTimestamp(),
    };

    return appointments[index];
  }

  // Storage operations (simplified)
  async createFile(bucketId: string, fileId: string, file: any) {
    // Mock file creation - just return a mock file object
    return {
      $id: fileId,
      $createdAt: getCurrentTimestamp(),
      $updatedAt: getCurrentTimestamp(),
      name: file.name || 'mock-file',
      size: file.size || 0,
      mimeType: file.mimeType || 'application/octet-stream',
    };
  }

  // Messaging operations (simplified)
  async createSms(messageId: string, content: string, topics: string[], users: string[]) {
    // Mock SMS creation - just log the message
    console.log('Mock SMS sent:', { messageId, content, users });
    return {
      $id: messageId,
      $createdAt: getCurrentTimestamp(),
      $updatedAt: getCurrentTimestamp(),
      content,
      topics,
      users,
    };
  }

  // Utility method to seed with sample data
  seedSampleData() {
    // Add multiple sample users for testing
    const sampleUsers: MockUser[] = [
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1234567891',
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1234567892',
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1234567893',
      }
    ];

    users.push(...sampleUsers);

    // Add comprehensive sample patients
    const samplePatients: MockPatient[] = [
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        userId: sampleUsers[0].$id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        birthDate: '1990-05-15',
        gender: 'male',
        address: '123 Main Street, Downtown, NY 10001',
        occupation: 'Software Engineer',
        emergencyContactName: 'Jane Doe',
        emergencyContactNumber: '+1234567891',
        primaryPhysician: 'Dr. Sarah Wilson',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS123456789',
        allergies: 'Penicillin, Shellfish',
        currentMedication: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
        familyMedicalHistory: 'Father: Type 2 Diabetes, Heart Disease. Mother: Hypertension. Sister: Asthma',
        pastMedicalHistory: 'Appendectomy (2015), Fractured wrist (2018), Type 2 Diabetes diagnosis (2020)',
        identificationType: 'Driver License',
        identificationNumber: 'DL123456789',
        identificationDocumentId: 'doc_123',
        identificationDocumentUrl: 'https://example.com/documents/dl_123456789.pdf',
        privacyConsent: true,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        userId: sampleUsers[1].$id,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1234567891',
        birthDate: '1985-12-03',
        gender: 'female',
        address: '456 Oak Avenue, Suburbia, CA 90210',
        occupation: 'Marketing Manager',
        emergencyContactName: 'David Johnson',
        emergencyContactNumber: '+1234567892',
        primaryPhysician: 'Dr. Michael Brown',
        insuranceProvider: 'Aetna',
        insurancePolicyNumber: 'AET987654321',
        allergies: 'Latex, Peanuts',
        currentMedication: 'Zoloft 50mg daily, Birth control pill',
        familyMedicalHistory: 'Mother: Breast Cancer (survivor), Depression. Father: High Cholesterol',
        pastMedicalHistory: 'C-section (2018), Tonsillectomy (1995), Depression diagnosis (2019)',
        identificationType: 'Passport',
        identificationNumber: 'P123456789',
        identificationDocumentId: 'doc_456',
        identificationDocumentUrl: 'https://example.com/documents/passport_123456789.pdf',
        privacyConsent: true,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        userId: sampleUsers[2].$id,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1234567892',
        birthDate: '1978-08-22',
        gender: 'male',
        address: '789 Pine Street, Chinatown, CA 94108',
        occupation: 'Financial Analyst',
        emergencyContactName: 'Lisa Chen',
        emergencyContactNumber: '+1234567893',
        primaryPhysician: 'Dr. Jennifer Lee',
        insuranceProvider: 'Kaiser Permanente',
        insurancePolicyNumber: 'KP456789123',
        allergies: 'None known',
        currentMedication: 'Atorvastatin 20mg daily, Aspirin 81mg daily',
        familyMedicalHistory: 'Father: Hypertension, Diabetes. Mother: Osteoporosis. Brother: High Blood Pressure',
        pastMedicalHistory: 'Gallbladder removal (2016), Hernia repair (2019), High cholesterol diagnosis (2017)',
        identificationType: 'State ID Card',
        identificationNumber: 'ID987654321',
        identificationDocumentId: 'doc_789',
        identificationDocumentUrl: 'https://example.com/documents/state_id_987654321.pdf',
        privacyConsent: true,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        userId: sampleUsers[3].$id,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1234567893',
        birthDate: '1992-03-10',
        gender: 'female',
        address: '321 Elm Street, Little Havana, FL 33125',
        occupation: 'Registered Nurse',
        emergencyContactName: 'Carlos Rodriguez',
        emergencyContactNumber: '+1234567894',
        primaryPhysician: 'Dr. Robert Garcia',
        insuranceProvider: 'UnitedHealth Group',
        insurancePolicyNumber: 'UHG789123456',
        allergies: 'Sulfa drugs, Bee stings',
        currentMedication: 'Albuterol inhaler as needed, Multivitamin daily',
        familyMedicalHistory: 'Father: Asthma, Heart Disease. Mother: Diabetes. Grandmother: Alzheimer\'s',
        pastMedicalHistory: 'Asthma diagnosis (1995), Wisdom teeth removal (2010), Sprained ankle (2021)',
        identificationType: 'Military ID Card',
        identificationNumber: 'MID123789456',
        identificationDocumentId: 'doc_321',
        identificationDocumentUrl: 'https://example.com/documents/military_id_123789456.pdf',
        privacyConsent: true,
      }
    ];

    patients.push(...samplePatients);

    // Add sample appointments for each patient
    const sampleAppointments: MockAppointment[] = [
      // John Doe's appointments
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[0],
        schedule: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'pending',
        primaryPhysician: 'Dr. Sarah Wilson',
        reason: 'Diabetes follow-up and medication review',
        note: 'Patient reports increased thirst and frequent urination. Check blood sugar levels.',
        userId: samplePatients[0].userId,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[0],
        schedule: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        status: 'scheduled',
        primaryPhysician: 'Dr. Sarah Wilson',
        reason: 'Annual physical examination',
        note: 'Routine checkup completed. Blood pressure: 130/85. Weight: 180 lbs.',
        userId: samplePatients[0].userId,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[0],
        schedule: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
        status: 'cancelled',
        primaryPhysician: 'Dr. Sarah Wilson',
        reason: 'Blood work follow-up',
        note: 'Patient cancelled due to work emergency',
        cancellationReason: 'Work emergency - rescheduled for next week',
        userId: samplePatients[0].userId,
      },

      // Sarah Johnson's appointments
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[1],
        schedule: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        status: 'scheduled',
        primaryPhysician: 'Dr. Michael Brown',
        reason: 'Depression medication review',
        note: 'Patient reports improved mood and sleep patterns. Continue current medication.',
        userId: samplePatients[1].userId,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[1],
        schedule: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        status: 'scheduled',
        primaryPhysician: 'Dr. Michael Brown',
        reason: 'Annual gynecological exam',
        note: 'Routine exam completed. All results normal.',
        userId: samplePatients[1].userId,
      },

      // Michael Chen's appointments
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[2],
        schedule: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        status: 'pending',
        primaryPhysician: 'Dr. Jennifer Lee',
        reason: 'Cholesterol check and medication adjustment',
        note: 'Patient reports some muscle pain with current statin. Consider alternative medication.',
        userId: samplePatients[2].userId,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[2],
        schedule: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
        status: 'scheduled',
        primaryPhysician: 'Dr. Jennifer Lee',
        reason: 'Blood pressure monitoring',
        note: 'BP: 135/88. Slightly elevated. Continue monitoring and lifestyle modifications.',
        userId: samplePatients[2].userId,
      },

      // Emily Rodriguez's appointments
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[3],
        schedule: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        status: 'scheduled',
        primaryPhysician: 'Dr. Robert Garcia',
        reason: 'Asthma control check',
        note: 'Patient reports good control with current medication. Peak flow: 450 L/min.',
        userId: samplePatients[3].userId,
      },
      {
        $id: generateId(),
        $createdAt: getCurrentTimestamp(),
        $updatedAt: getCurrentTimestamp(),
        patient: samplePatients[3],
        schedule: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        status: 'scheduled',
        primaryPhysician: 'Dr. Robert Garcia',
        reason: 'Annual physical and vaccinations',
        note: 'Physical completed. Administered flu shot and tetanus booster.',
        userId: samplePatients[3].userId,
      }
    ];

    appointments.push(...sampleAppointments);
  }
}

// Create and export a singleton instance
export const mockDb = new MockDatabase();

// Seed with sample data for development
if (typeof window === 'undefined') {
  // Only seed on server side
  mockDb.seedSampleData();
} 