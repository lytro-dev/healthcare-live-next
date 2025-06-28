import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";

const PatientProfile = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
          <Link href="/">
            <Button className="shad-primary-btn">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[1000px]">
          <div className="flex items-center justify-between mb-8">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="h-10 w-fit"
            />
            <div className="flex gap-4">
              <Link href={`/patients/${userId}/dashboard`}>
                <Button variant="outline" className="shad-gray-btn">
                  Dashboard
                </Button>
              </Link>
              <Link href={`/patients/${userId}/register`}>
                <Button className="shad-primary-btn">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="bg-dark-400 rounded-lg p-6 mb-8">
            <h1 className="header mb-2">Patient Profile</h1>
            <p className="text-dark-700">Your personal and medical information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-14-medium text-dark-700">Full Name</label>
                  <p className="text-16-regular">{patient.name}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Email</label>
                  <p className="text-16-regular">{patient.email}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Phone</label>
                  <p className="text-16-regular">{patient.phone}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Date of Birth</label>
                  <p className="text-16-regular">{new Date(patient.birthDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Gender</label>
                  <p className="text-16-regular">{patient.gender}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Address</label>
                  <p className="text-16-regular">{patient.address}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Occupation</label>
                  <p className="text-16-regular">{patient.occupation}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-14-medium text-dark-700">Primary Physician</label>
                  <p className="text-16-regular">{patient.primaryPhysician}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Insurance Provider</label>
                  <p className="text-16-regular">{patient.insuranceProvider}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Insurance Policy Number</label>
                  <p className="text-16-regular">{patient.insurancePolicyNumber}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Allergies</label>
                  <p className="text-16-regular">{patient.allergies || "None reported"}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Current Medications</label>
                  <p className="text-16-regular">{patient.currentMedication || "None"}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-14-medium text-dark-700">Contact Name</label>
                  <p className="text-16-regular">{patient.emergencyContactName}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Contact Number</label>
                  <p className="text-16-regular">{patient.emergencyContactNumber}</p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Medical History</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-14-medium text-dark-700">Family Medical History</label>
                  <p className="text-16-regular">{patient.familyMedicalHistory || "None reported"}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Past Medical History</label>
                  <p className="text-16-regular">{patient.pastMedicalHistory || "None reported"}</p>
                </div>
              </div>
            </div>

            {/* Identification */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Identification</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-14-medium text-dark-700">Identification Type</label>
                  <p className="text-16-regular">{patient.identificationType || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-14-medium text-dark-700">Identification Number</label>
                  <p className="text-16-regular">{patient.identificationNumber || "Not provided"}</p>
                </div>
                {patient.identificationDocumentUrl && (
                  <div>
                    <label className="text-14-medium text-dark-700">Document</label>
                    <p className="text-16-regular">
                      <a 
                        href={patient.identificationDocumentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-400"
                      >
                        View Document
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Consent */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Privacy & Consent</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${patient.privacyConsent ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-16-regular">
                    Privacy Policy Consent: {patient.privacyConsent ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="copyright mt-8">© 2024 CarePluse</p>
        </div>
      </section>
    </div>
  );
};

export default PatientProfile; 