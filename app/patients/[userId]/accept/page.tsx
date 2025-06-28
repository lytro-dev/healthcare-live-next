import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const AppointmentAcceptance = async ({ params: { userId } }: SearchParamProps) => {
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

  // Filter pending appointments for this patient
  const pendingAppointments = appointmentsData?.documents?.filter(
    (appointment: any) => 
      appointment.userId === userId && 
      appointment.status === "pending"
  ) || [];

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
              <Link href={`/patients/${userId}/new-appointment`}>
                <Button className="shad-primary-btn">
                  New Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="bg-dark-400 rounded-lg p-6 mb-8">
            <h1 className="header mb-2">Appointment Acceptance</h1>
            <p className="text-dark-700">Review and accept your pending appointments</p>
          </div>

          {pendingAppointments.length > 0 ? (
            <div className="space-y-6">
              {pendingAppointments.map((appointment: any) => (
                <div key={appointment.$id} className="bg-dark-400 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-18-bold mb-2">{appointment.primaryPhysician}</h3>
                      <p className="text-16-regular text-dark-600">
                        {formatDateTime(appointment.schedule).dateTime}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500 text-white">
                      Pending Acceptance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-14-medium text-dark-700">Appointment Reason</label>
                      <p className="text-16-regular">{appointment.reason}</p>
                    </div>
                    <div>
                      <label className="text-14-medium text-dark-700">Notes</label>
                      <p className="text-16-regular">{appointment.note || "No additional notes"}</p>
                    </div>
                  </div>

                  <div className="bg-dark-300 rounded-lg p-4 mb-6">
                    <h4 className="text-16-semibold mb-2">Appointment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-14-regular">
                      <div>
                        <span className="text-dark-600">Date:</span> {formatDateTime(appointment.schedule).dateOnly}
                      </div>
                      <div>
                        <span className="text-dark-600">Time:</span> {formatDateTime(appointment.schedule).timeOnly}
                      </div>
                      <div>
                        <span className="text-dark-600">Doctor:</span> {appointment.primaryPhysician}
                      </div>
                      <div>
                        <span className="text-dark-600">Status:</span> {appointment.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="shad-primary-btn flex-1">
                      Accept Appointment
                    </Button>
                    <Button variant="outline" className="shad-danger-btn flex-1">
                      Decline Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-400 rounded-lg p-12 text-center">
              <Image
                src="/assets/icons/check-circle.svg"
                width={64}
                height={64}
                alt="no pending"
                className="mx-auto mb-4"
              />
              <h3 className="text-18-bold mb-2">No Pending Appointments</h3>
              <p className="text-dark-600 mb-6">
                You don't have any appointments waiting for acceptance.
              </p>
              <Link href={`/patients/${userId}/new-appointment`}>
                <Button className="shad-primary-btn">
                  Book New Appointment
                </Button>
              </Link>
            </div>
          )}

          <p className="copyright mt-8">© 2024 CarePluse</p>
        </div>
      </section>
    </div>
  );
};

export default AppointmentAcceptance; 