import { Video, Building2, Calendar, Clock, User } from "lucide-react";

const MyAppointments = ({ appointments }) => {
  if (appointments.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-3xl shadow-elevated border border-border/50 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Upcoming Appointments</h3>
          <p className="text-muted-foreground">
            You don't have any upcoming appointments scheduled.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-card rounded-2xl shadow-soft border border-border/50 p-6 hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium bg-primary-light text-primary px-2 py-1 rounded-full">
                    {apt.id}
                  </span>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {apt.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{apt.doctorName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{apt.specialization}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{formatDate(apt.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm pl-6">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{apt.appointmentTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-4">
                {apt.consultationMode === "virtual" ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Virtual</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground">In-Person</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
