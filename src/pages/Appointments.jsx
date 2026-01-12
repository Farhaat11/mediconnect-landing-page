import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Video, Building2 } from "lucide-react";

const Appointments = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "virtual",
    reasonForVisit: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const doctors = [
    "Dr. Sarah Johnson - General Physician",
    "Dr. Michael Chen - Cardiologist",
    "Dr. Emily Davis - Dermatologist",
    "Dr. Robert Wilson - Orthopedic",
    "Dr. Lisa Anderson - Pediatrician",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        patientName: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: "",
        consultationType: "virtual",
        reasonForVisit: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/patient-dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Book an Appointment
            </h1>
            <p className="text-gray-500 mt-2">
              Schedule your consultation with our healthcare professionals
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Appointment Submitted!
              </h2>
              <p className="text-gray-500">
                We'll confirm your appointment shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="text-gray-400" />
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope size={16} className="text-gray-400" />
                  Select Doctor
                </label>
                <select
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-white"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Appointment Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  />
                </div>

                {/* Appointment Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Consultation Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Virtual Consultation */}
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.consultationType === "virtual"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="virtual"
                      checked={formData.consultationType === "virtual"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Video
                      size={20}
                      className={
                        formData.consultationType === "virtual"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <span
                      className={`font-medium ${
                        formData.consultationType === "virtual"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      Virtual Consultation
                    </span>
                  </label>

                  {/* In-Person Consultation */}
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.consultationType === "in-person"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="in-person"
                      checked={formData.consultationType === "in-person"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Building2
                      size={20}
                      className={
                        formData.consultationType === "in-person"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <span
                      className={`font-medium ${
                        formData.consultationType === "in-person"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      In-Person Consultation
                    </span>
                  </label>
                </div>

                {/* Conditional Info Box */}
                {formData.consultationType === "virtual" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Video size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Virtual Consultation
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          A meeting link will be shared via email after your
                          appointment is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.consultationType === "in-person" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Building2 size={20} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Clinic Address
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          MediConnect Health Center
                          <br />
                          123 Healthcare Avenue, Medical District
                          <br />
                          New Delhi, India - 110001
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  name="reasonForVisit"
                  value={formData.reasonForVisit}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Please describe your symptoms or reason for this appointment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Submit Appointment
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Appointments;
