import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const AppointmentHistory = async ({ params: { userId } }: SearchParamProps) => {
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

  // Filter appointments for this patient
  const patientAppointments = appointmentsData?.documents?.filter(
    (appointment: any) => appointment.userId === userId
  ) || [];

  const upcomingAppointments = patientAppointments.filter(
    (appointment: any) => 
      appointment.status === "scheduled" && 
      new Date(appointment.schedule) > new Date()
  );

  const pastAppointments = patientAppointments.filter(
    (appointment: any) => 
      new Date(appointment.schedule) <= new Date()
  );

  const pendingAppointments = patientAppointments.filter(
    (appointment: any) => appointment.status === "pending"
  );

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
              <Link href={`/patients/${userId}/new-appointment`}>
                <Button className="shad-primary-btn">
                  New Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="bg-dark-400 rounded-lg p-6 mb-8">
            <h1 className="header mb-2">Appointment History</h1>
            <p className="text-dark-700">View all your appointments and their status</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Total</h3>
              <p className="text-36-bold text-blue-500">{patientAppointments.length}</p>
            </div>
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Upcoming</h3>
              <p className="text-36-bold text-green-500">{upcomingAppointments.length}</p>
            </div>
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Pending</h3>
              <p className="text-36-bold text-yellow-500">{pendingAppointments.length}</p>
            </div>
            <div className="bg-dark-400 rounded-lg p-6">
              <h3 className="text-18-bold mb-2">Completed</h3>
              <p className="text-36-bold text-gray-500">{pastAppointments.length}</p>
            </div>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div className="bg-dark-400 rounded-lg p-6 mb-8">
              <h3 className="text-18-bold mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment: any) => (
                  <div key={appointment.$id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/assets/icons/calendar.svg"
                        width={24}
                        height={24}
                        alt="calendar"
                      />
                      <div>
                        <p className="text-16-semibold">{appointment.primaryPhysician}</p>
                        <p className="text-14-regular text-dark-600">
                          {formatDateTime(appointment.schedule).dateTime}
                        </p>
                        <p className="text-14-regular text-dark-600">
                          Reason: {appointment.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded text-xs bg-green-500 text-white">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Appointments */}
          {pendingAppointments.length > 0 && (
            <div className="bg-dark-400 rounded-lg p-6 mb-8">
              <h3 className="text-18-bold mb-4">Pending Appointments</h3>
              <div className="space-y-4">
                {pendingAppointments.map((appointment: any) => (
                  <div key={appointment.$id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/assets/icons/pending.svg"
                        width={24}
                        height={24}
                        alt="pending"
                      />
                      <div>
                        <p className="text-16-semibold">{appointment.primaryPhysician}</p>
                        <p className="text-14-regular text-dark-600">
                          {formatDateTime(appointment.schedule).dateTime}
                        </p>
                        <p className="text-14-regular text-dark-600">
                          Reason: {appointment.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500 text-white">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          <div className="bg-dark-400 rounded-lg p-6">
            <h3 className="text-18-bold mb-4">Past Appointments</h3>
            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment: any) => (
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
                        appointment.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-600">No past appointments</p>
            )}
          </div>

          <p className="copyright mt-8">© 2024 CarePluse</p>
        </div>
      </section>
    </div>
  );
};

export default AppointmentHistory; 