import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Phone, ArrowLeft, Clock, User, Mic, MicOff, VideoOff, Calendar, CheckCircle } from "lucide-react";
import { useAppointments } from "../Context/AppointmentContext";

const DoctorVideoCall = () => {
  const navigate = useNavigate();
  const { appointments, completeAppointment } = useAppointments();
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Filter only Virtual + Upcoming appointments
  const virtualAppointments = appointments.filter(
    (apt) => apt.consultationMode === "Virtual" && apt.status === "Upcoming"
  );

  const handleJoinCall = (appointment) => {
    setActiveCall(appointment);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleCompleteCall = () => {
    if (activeCall) {
      completeAppointment(activeCall.id);
      setActiveCall(null);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  // Video Call Screen
  if (activeCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video Call Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <Video className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Virtual Consultation</h2>
              <p className="text-gray-400 text-sm">Connected with {activeCall.patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800 px-4 py-2 rounded-lg">
              <Calendar size={16} />
              <span className="text-sm">{activeCall.appointmentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800 px-4 py-2 rounded-lg">
              <Clock size={16} />
              <span className="text-sm">{activeCall.appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-4xl">
            {/* Patient Video (Main) */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-600">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <User size={64} className="text-white" />
                </div>
                <p className="text-white text-2xl font-bold">{activeCall.patientName}</p>
                <p className="text-gray-400 text-lg">Age: {activeCall.patientAge} years</p>
              </div>
              
              {/* Doctor Self View (Small) */}
              <div className="absolute bottom-4 right-4 w-40 h-28 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center shadow-lg border border-gray-500">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-1">
                    <User size={24} className="text-white" />
                  </div>
                  <span className="text-gray-300 text-xs">You (Doctor)</span>
                </div>
                {isCameraOff && (
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90 rounded-xl flex items-center justify-center">
                    <VideoOff size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Call Info Banner */}
            <div className="mt-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-4 text-center border border-indigo-700">
              <p className="text-indigo-200 text-sm">
                ⚠️ This is a UI placeholder - No real video integration
              </p>
            </div>
          </div>
        </div>

        {/* Call Controls Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6 border-t border-gray-700">
          <div className="flex justify-center items-center gap-4">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                isMuted 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Camera Button */}
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                isCameraOff 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
              title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
              title="Leave Call"
            >
              <Phone size={24} className="rotate-135" />
            </button>

            {/* Complete Call Button (Doctor Only) */}
            <button
              onClick={handleCompleteCall}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg ml-4"
              title="Complete Consultation"
            >
              <CheckCircle size={20} />
              Complete Call
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            Click "Complete Call" to end the consultation and mark it as completed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Video className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Video Consultations
              </h1>
              <p className="text-gray-500">Manage your virtual appointments</p>
            </div>
          </div>

          {/* Appointments List */}
          {virtualAppointments.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Upcoming Virtual Appointments
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                You don't have any scheduled virtual consultations at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {virtualAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                          Virtual Consultation
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Upcoming
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {apt.patientName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm">
                          Age: {apt.patientAge} years
                        </span>
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm">
                          📞 {apt.patientPhone}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Calendar size={16} className="text-indigo-500" />
                          {apt.appointmentDate}
                        </span>
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Clock size={16} className="text-indigo-500" />
                          {apt.appointmentTime}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinCall(apt)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Video size={20} />
                      Join Video Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVideoCall;
