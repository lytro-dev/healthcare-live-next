import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const MedicalRecords = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  const appointmentsData = await getRecentAppointmentList();

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

  // Filter completed appointments for this patient
  const completedAppointments = appointmentsData?.documents?.filter(
    (appointment: any) => 
      appointment.userId === userId && 
      new Date(appointment.schedule) <= new Date()
  ) || [];

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[1200px]">
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
              <Link href={`/patients/${userId}/profile`}>
                <Button className="shad-primary-btn">
                  Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="bg-dark-400 rounded-lg p-6 mb-8">
            <h1 className="header mb-2">Medical Records</h1>
            <p className="text-dark-700">Your complete medical history and health information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Medications */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Current Medications</h3>
              {patient.currentMedication ? (
                <div className="space-y-4">
                  <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-16-regular">{patient.currentMedication}</p>
                  </div>
                </div>
              ) : (
                <p className="text-dark-600">No current medications</p>
              )}
            </div>

            {/* Allergies */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Allergies</h3>
              {patient.allergies ? (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-16-regular text-red-400">{patient.allergies}</p>
                  </div>
                </div>
              ) : (
                <p className="text-dark-600">No known allergies</p>
              )}
            </div>

            {/* Family Medical History */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Family Medical History</h3>
              {patient.familyMedicalHistory ? (
                <div className="space-y-4">
                  <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-16-regular">{patient.familyMedicalHistory}</p>
                  </div>
                </div>
              ) : (
                <p className="text-dark-600">No family medical history recorded</p>
              )}
            </div>

            {/* Past Medical History */}
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-6">Past Medical History</h3>
              {patient.pastMedicalHistory ? (
                <div className="space-y-4">
                  <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-16-regular">{patient.pastMedicalHistory}</p>
                  </div>
                </div>
              ) : (
                <p className="text-dark-600">No past medical history recorded</p>
              )}
            </div>
          </div>

          {/* Insurance Information */}
          <div className="bg-dark-400 rounded-lg p-6 mt-8">
            <h3 className="text-18-bold mb-6">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-14-medium text-dark-700">Insurance Provider</label>
                <p className="text-16-regular">{patient.insuranceProvider}</p>
              </div>
              <div>
                <label className="text-14-medium text-dark-700">Policy Number</label>
                <p className="text-16-regular">{patient.insurancePolicyNumber}</p>
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-dark-400 rounded-lg p-6 mt-8">
            <h3 className="text-18-bold mb-6">Appointment History</h3>
            {completedAppointments.length > 0 ? (
              <div className="space-y-4">
                {completedAppointments.map((appointment: any) => (
                  <div key={appointment.$id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/assets/icons/check-circle.svg"
                        width={24}
                        height={24}
                        alt="completed"
                      />
                      <div>
                        <p className="text-16-semibold">{appointment.primaryPhysician}</p>
                        <p className="text-14-regular text-dark-600">
                          {formatDateTime(appointment.schedule).dateTime}
                        </p>
                        <p className="text-14-regular text-dark-600">
                          Reason: {appointment.reason}
                        </p>
                        {appointment.note && (
                          <p className="text-14-regular text-dark-600">
                            Note: {appointment.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-600">No completed appointments yet</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="bg-dark-400 rounded-lg p-6 mt-8">
            <h3 className="text-18-bold mb-6">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <p className="copyright mt-8">© 2024 CarePluse</p>
        </div>
      </section>
    </div>
  );
};

export default MedicalRecords; 