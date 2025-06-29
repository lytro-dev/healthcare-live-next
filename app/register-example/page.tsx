"use client";

import { useState } from "react";
import { registerUser, registerPatient, completeRegistration } from "@/lib/actions/register.actions";

export default function RegisterExample() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async () => {
    setLoading(true);
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890"
    };

    const result = await registerUser(userData);
    setResult(result);
    setLoading(false);
  };

  const handleRegisterPatient = async () => {
    setLoading(true);
    const patientData = {
      userId: "user-123", // This would come from a registered user
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      birthDate: new Date("1990-01-01"),
      gender: "Male" as const,
      address: "123 Main St, City, State",
      occupation: "Software Engineer",
      emergencyContactName: "Jane Doe",
      emergencyContactNumber: "+1234567891",
      primaryPhysician: "Dr. Smith",
      insuranceProvider: "Blue Cross",
      insurancePolicyNumber: "POL123456",
      allergies: "None",
      currentMedication: "None",
      familyMedicalHistory: "None",
      pastMedicalHistory: "None",
      identificationType: "Driver's License",
      identificationNumber: "DL123456789",
      privacyConsent: true
    };

    const result = await registerPatient(patientData);
    setResult(result);
    setLoading(false);
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    const userData = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567892"
    };

    const patientData = {
      birthDate: new Date("1985-05-15"),
      gender: "Female" as const,
      address: "456 Oak Ave, City, State",
      occupation: "Teacher",
      emergencyContactName: "John Smith",
      emergencyContactNumber: "+1234567893",
      primaryPhysician: "Dr. Johnson",
      insuranceProvider: "Aetna",
      insurancePolicyNumber: "POL789012",
      allergies: "Penicillin",
      currentMedication: "None",
      familyMedicalHistory: "Heart disease",
      pastMedicalHistory: "Appendectomy",
      identificationType: "Passport",
      identificationNumber: "PASS123456",
      privacyConsent: true
    };

    const result = await completeRegistration(userData, patientData);
    setResult(result);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Register Actions Example</h1>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Register User Only</h2>
          <button
            onClick={handleRegisterUser}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Register Patient Only</h2>
          <button
            onClick={handleRegisterPatient}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Complete Registration (User + Patient)</h2>
          <button
            onClick={handleCompleteRegistration}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </button>
        </div>

        {result && (
          <div className="p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-yellow-50">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">1. Register User Only:</h3>
            <p>Use <code>registerUser()</code> when you only need to create a user account without patient details.</p>
          </div>
          <div>
            <h3 className="font-semibold">2. Register Patient Only:</h3>
            <p>Use <code>registerPatient()</code> when you have an existing user and want to add patient information.</p>
          </div>
          <div>
            <h3 className="font-semibold">3. Complete Registration:</h3>
            <p>Use <code>completeRegistration()</code> to register both user and patient in one call.</p>
          </div>
          <div>
            <h3 className="font-semibold">Note:</h3>
            <p>All actions use the mock database and return structured responses with success/error status.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 