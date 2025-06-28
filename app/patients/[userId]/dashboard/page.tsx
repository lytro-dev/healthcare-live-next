import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPatient, getPatientByEmail, getUser } from "@/lib/actions/patient.actions";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const PatientDashboard = async ({ params: { userId } }: SearchParamProps) => {
  // Try to get patient by userId first
  let patient = await getPatient(userId);
  
  // If not found, try to get user and then patient by email
  if (!patient) {
    const user = await getUser(userId);
    if (user && user.email) {
      patient = await getPatientByEmail(user.email);
    }
  }
  
  const appointmentsData = await getRecentAppointmentList();

  // Fallback data if patient is not found
  const fallbackPatient = {
    name: 'Demo Patient',
    primaryPhysician: 'Dr. Demo Doctor',
    email: 'demo@example.com',
    phone: '+1234567890',
    birthDate: '1990-01-01',
    gender: 'male',
    address: '123 Demo Street, Demo City',
    occupation: 'Demo Occupation',
    emergencyContactName: 'Demo Contact',
    emergencyContactNumber: '+1234567891',
    insuranceProvider: 'Demo Insurance',
    insurancePolicyNumber: 'DEMO123456',
    allergies: 'None',
    currentMedication: 'None',
    familyMedicalHistory: 'None',
    pastMedicalHistory: 'None',
    identificationType: 'Demo ID',
    identificationNumber: 'DEMO123',
    privacyConsent: true,
  };

  // Use fallback data if patient is not found
  const displayPatient = patient || fallbackPatient;

  // Filter appointments for this patient
  const patientAppointments = appointmentsData?.documents?.filter(
    (appointment: any) => appointment.userId === userId
  ) || [];

  // Add fallback appointments if none exist
  const fallbackAppointments = [
    {
      $id: 'fallback-1',
      primaryPhysician: 'Dr. Sarah Wilson',
      schedule: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      reason: 'Annual checkup',
      note: 'Routine examination',
    },
    {
      $id: 'fallback-2',
      primaryPhysician: 'Dr. Michael Brown',
      schedule: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      reason: 'Follow-up appointment',
      note: 'Medication review',
    },
    {
      $id: 'fallback-3',
      primaryPhysician: 'Dr. Jennifer Lee',
      schedule: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'cancelled',
      reason: 'Blood work',
      note: 'Cancelled due to scheduling conflict',
    }
  ];

  const allAppointments = patientAppointments.length > 0 ? patientAppointments : fallbackAppointments;

  const upcomingAppointments = allAppointments.filter(
    (appointment: any) => 
      appointment.status === "scheduled" && 
      new Date(appointment.schedule) > new Date()
  );

  const recentAppointments = allAppointments
    .sort((a: any, b: any) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime())
    .slice(0, 5);

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
              <Link href={`/patients/${userId}/profile`}>
                <Button variant="outline" className="shad-gray-btn">
                  Profile
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="shad-gray-btn">
                  Logout
                </Button>
              </Link>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="bg-dark-400 rounded-lg p-6 mb-8">
            <h1 className="header mb-2">Welcome back, {displayPatient.name}! 👋</h1>
            <p className="text-dark-700">Here's your healthcare overview</p>
            {!patient && (
              <p className="text-yellow-500 text-sm mt-2">
                ⚠️ Demo data shown - Patient profile not found
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Upcoming Appointments</h3>
              <p className="text-36-bold text-green-500">{upcomingAppointments.length}</p>
            </div>
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Total Appointments</h3>
              <p className="text-36-bold text-blue-500">{allAppointments.length}</p>
            </div>
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Primary Doctor</h3>
              <p className="text-16-regular">{displayPatient.primaryPhysician}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href={`/patients/${userId}/new-appointment`}>
              <div className="bg-dark-400 rounded-lg p-6 hover:bg-dark-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/icons/appointments.svg"
                    width={48}
                    height={48}
                    alt="appointments"
                  />
                  <div>
                    <h3 className="text-18-bold mb-2">Book New Appointment</h3>
                    <p className="text-dark-700">Schedule your next visit</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href={`/patients/${userId}/history`}>
              <div className="bg-dark-400 rounded-lg p-6 hover:bg-dark-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/icons/calendar.svg"
                    width={48}
                    height={48}
                    alt="history"
                  />
                  <div>
                    <h3 className="text-18-bold mb-2">View History</h3>
                    <p className="text-dark-700">Check your appointment history</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Appointments */}
          <div className="bg-dark-400 rounded-lg p-6">
            <h3 className="text-18-bold mb-4">Recent Appointments</h3>
            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment: any) => (
                  <div key={appointment.$id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                    <div>
                      <p className="text-16-semibold">{appointment.primaryPhysician}</p>
                      <p className="text-14-regular text-dark-600">
                        {formatDateTime(appointment.schedule).dateTime}
                      </p>
                      {appointment.reason && (
                        <p className="text-14-regular text-dark-600">
                          Reason: {appointment.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'scheduled' ? 'bg-green-500 text-white' :
                        appointment.status === 'pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-600">No appointments yet</p>
            )}
          </div>

          <p className="copyright mt-8">© 2024 CarePluse</p>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard; 