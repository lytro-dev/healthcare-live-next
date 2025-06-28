import React, { useEffect, useState } from "react";
import { databases } from "@/lib/mock.config"; // Changed from direct Appwrite import
import { MockPatient } from "@/types/mock.types"; // Added mock types

interface PatientModalProps {
  patientId: string | null;
  closeModal: () => void;
}

interface PatientDetails {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // Changed from Date to string for mock compatibility
  gender: string;
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

export const PatientModal: React.FC<PatientModalProps> = ({
  patientId,
  closeModal,
}) => {
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (patientId) {
        try {
          const response = await databases.getDocument(
            'mock-database', // Use mock database ID
            'patient', // Use mock collection ID
            patientId
          );
          setPatientDetails(response as unknown as PatientDetails);
        } catch (error) {
          console.error("Failed to fetch patient details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patientDetails) {
    return <div>No patient details found.</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold underline font-mono">
            Patient Details
          </h2>
          <button
            className="text-gray-200 hover:text-gray-700"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
        <div className="space-y-4 font-mono">
          <p>
            <strong>Name:</strong> {patientDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {patientDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {patientDetails.phone}
          </p>
          <p>
            <strong>Birth Date:</strong> {patientDetails.birthDate}
          </p>
          <p>
            <strong>Gender:</strong> {patientDetails.gender}
          </p>
          <p>
            <strong>Address:</strong> {patientDetails.address}
          </p>
          <p>
            <strong>Occupation:</strong> {patientDetails.occupation}
          </p>
          <p>
            <strong>Emergency Contact Name:</strong>{" "}
            {patientDetails.emergencyContactName}
          </p>
          <p>
            <strong>Emergency Contact Number:</strong>{" "}
            {patientDetails.emergencyContactNumber}
          </p>
          <p>
            <strong>Primary Physician:</strong>{" "}
            {patientDetails.primaryPhysician}
          </p>
          <p>
            <strong>Insurance Provider:</strong>{" "}
            {patientDetails.insuranceProvider}
          </p>
          <p>
            <strong>Insurance Policy Number:</strong>{" "}
            {patientDetails.insurancePolicyNumber}
          </p>
          <p>
            <strong>Allergies:</strong> {patientDetails.allergies || "None"}
          </p>
          <p>
            <strong>Current Medication:</strong>{" "}
            {patientDetails.currentMedication || "None"}
          </p>
          <p>
            <strong>Family Medical History:</strong>{" "}
            {patientDetails.familyMedicalHistory || "None"}
          </p>
          <p>
            <strong>Past Medical History:</strong>{" "}
            {patientDetails.pastMedicalHistory || "None"}
          </p>
          <p>
            <strong>Identification Type:</strong>{" "}
            {patientDetails.identificationType || "None"}
          </p>
          <p>
            <strong>Identification Number:</strong>{" "}
            {patientDetails.identificationNumber || "None"}
          </p>
          <p>
            <strong>Privacy Consent:</strong>{" "}
            {patientDetails.privacyConsent ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};
