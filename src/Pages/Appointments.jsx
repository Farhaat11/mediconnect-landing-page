import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Video, Building2, Phone, Mail, Users } from "lucide-react";
import { useAppointments } from "../Context/AppointmentContext";
import appointmentData from "../data/appointmentData.json";

// Generate 30-minute time slots for morning (09:00-12:00) and evening (16:00-20:00)
const generateTimeSlots = () => {
  const slots = [];
  
  // Morning slots: 09:00 - 12:00
  for (let hour = 9; hour < 12; hour++) {
    const startHour = hour.toString().padStart(2, "0");
    const endHour = hour.toString().padStart(2, "0");
    const nextHour = (hour + 1).toString().padStart(2, "0");
    
    slots.push(`${startHour}:00 - ${startHour}:30`);
    slots.push(`${startHour}:30 - ${nextHour}:00`);
  }
  
  // Evening slots: 16:00 - 20:00
  for (let hour = 16; hour < 20; hour++) {
    const startHour = hour.toString().padStart(2, "0");
    const nextHour = (hour + 1).toString().padStart(2, "0");
    
    slots.push(`${startHour}:00 - ${startHour}:30`);
    slots.push(`${startHour}:30 - ${nextHour}:00`);
  }
  
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const Appointments = () => {
  const navigate = useNavigate();
  const { addAppointment } = useAppointments();

  const { doctorSpecializations, doctorsBySpecialization } = appointmentData;
  
  const [formData, setFormData] = useState({
    doctorSpecialization: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "virtual",
  });

  const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
  const [personalData, setPersonalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    insurancePolicy: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const availableDoctors = formData.doctorSpecialization
    ? doctorsBySpecialization[formData.doctorSpecialization] || []
    : [];

  const validateForm = () => {
    const newErrors = {};

    // Validate personal data only if booking for someone else
    if (bookingForSomeoneElse) {
      if (!personalData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (personalData.fullName.trim().length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters";
      }

      if (!personalData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (!personalData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(personalData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Enter a valid 10-digit phone number";
      }

      if (!personalData.gender) {
        newErrors.gender = "Gender is required";
      }

      if (!personalData.dob) {
        newErrors.dob = "Date of birth is required";
      } else {
        const dobDate = new Date(personalData.dob);
        const today = new Date();
        if (dobDate >= today) {
          newErrors.dob = "Date of birth must be a past date";
        }
      }
    }

    if (!formData.doctorSpecialization) {
      newErrors.doctorSpecialization = "Please select a specialization";
    }

    if (!formData.doctorName) {
      newErrors.doctorName = "Please select a doctor";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset doctor when specialization changes
    if (name === "doctorSpecialization") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        doctorName: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePersonalDataChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Build payload based on booking type
    const payload = bookingForSomeoneElse
      ? { ...formData, ...personalData }
      : { ...formData };

    // Add appointment to context/localStorage
    addAppointment(payload);

    setSubmitted(true);
    // Reset after 3 seconds and navigate to view
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        doctorSpecialization: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: "",
        consultationType: "virtual",
      });
      setPersonalData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        insurancePolicy: "",
      });
      setBookingForSomeoneElse(false);
      setErrors({});
      navigate("/appointments/view");
    }, 2000);
  };

  const inputBaseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none";
  const inputErrorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";
  const inputNormalClass = "border-gray-300";

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
                Appointment Booked Successfully!
              </h2>
              <p className="text-gray-500">
                Redirecting to your appointments...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Patient Details
                </h2>
                
                {/* Booking for Someone Else Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingForSomeoneElse}
                      onChange={(e) => {
                        setBookingForSomeoneElse(e.target.checked);
                        // Clear personal data errors when toggling
                        if (!e.target.checked) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fullName;
                            delete newErrors.email;
                            delete newErrors.phone;
                            delete newErrors.gender;
                            delete newErrors.dob;
                            return newErrors;
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Booking for someone else?
                    </span>
                  </label>
                </div>

                {/* Conditional Personal Data Fields */}
                {bookingForSomeoneElse && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={personalData.fullName}
                        onChange={handlePersonalDataChange}
                        placeholder="Enter patient's full name"
                        className={`${inputBaseClass} ${errors.fullName ? inputErrorClass : inputNormalClass}`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email and Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail size={14} className="text-gray-400" />
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={personalData.email}
                          onChange={handlePersonalDataChange}
                          placeholder="Enter email address"
                          className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Phone size={14} className="text-gray-400" />
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalData.phone}
                          onChange={handlePersonalDataChange}
                          placeholder="Enter 10-digit number"
                          className={`${inputBaseClass} ${errors.phone ? inputErrorClass : inputNormalClass}`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Gender and DOB Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={personalData.gender}
                          onChange={handlePersonalDataChange}
                          className={`${inputBaseClass} bg-white ${errors.gender ? inputErrorClass : inputNormalClass}`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={personalData.dob}
                          onChange={handlePersonalDataChange}
                          max={new Date().toISOString().split("T")[0]}
                          className={`${inputBaseClass} ${errors.dob ? inputErrorClass : inputNormalClass}`}
                        />
                        {errors.dob && (
                          <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
                        )}
                      </div>
                    </div>

                    {/* Insurance Policy (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Policy 
                      </label>
                      <input
                        type="text"
                        required={true}
                        name="insurancePolicy"
                        value={personalData.insurancePolicy}
                        onChange={handlePersonalDataChange}
                        placeholder="Enter insurance policy number"
                        className={`${inputBaseClass} ${inputNormalClass}`}
                      />
                    </div>
                  </div>
                )}

                {/* Info message when not booking for someone else */}
                {!bookingForSomeoneElse && (
                  <p className="text-sm text-gray-500 italic">
                    Your personal details will be fetched from your registered profile.
                  </p>
                )}
              </div>

              {/* Doctor Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Stethoscope size={20} className="text-blue-600" />
                  Doctor Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doctor Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="doctorSpecialization"
                      value={formData.doctorSpecialization}
                      onChange={handleChange}
                      className={`${inputBaseClass} bg-white ${errors.doctorSpecialization ? inputErrorClass : inputNormalClass}`}
                    >
                      <option value="">Select Specialization</option>
                      {doctorSpecializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.doctorSpecialization && (
                      <p className="mt-1 text-sm text-red-500">{errors.doctorSpecialization}</p>
                    )}
                  </div>

                  {/* Doctor Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleChange}
                      disabled={!formData.doctorSpecialization}
                      className={`${inputBaseClass} bg-white ${errors.doctorName ? inputErrorClass : inputNormalClass} ${!formData.doctorSpecialization ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    >
                      <option value="">
                        {formData.doctorSpecialization ? "Select Doctor" : "Select specialization first"}
                      </option>
                      {availableDoctors.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                    {errors.doctorName && (
                      <p className="mt-1 text-sm text-red-500">{errors.doctorName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointment Details Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Appointment Details
                </h2>

                {/* Date and Time Slot Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Appointment Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={14} className="text-gray-400" />
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`${inputBaseClass} ${errors.appointmentDate ? inputErrorClass : inputNormalClass}`}
                    />
                    {errors.appointmentDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.appointmentDate}</p>
                    )}
                  </div>

                  {/* Time Slot Selector */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={14} className="text-gray-400" />
                      Available Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      className={`${inputBaseClass} bg-white ${errors.appointmentTime ? inputErrorClass : inputNormalClass}`}
                    >
                      <option value="">Select Time Slot</option>
                      <optgroup label="Morning (09:00 - 12:00)">
                        {TIME_SLOTS.filter(slot => {
                          const hour = parseInt(slot.split(":")[0]);
                          return hour >= 9 && hour < 12;
                        }).map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Evening (16:00 - 20:00)">
                        {TIME_SLOTS.filter(slot => {
                          const hour = parseInt(slot.split(":")[0]);
                          return hour >= 16 && hour < 20;
                        }).map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.appointmentTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.appointmentTime}</p>
                    )}
                  </div>
                </div>

                {/* Mode of Consultation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode of Consultation <span className="text-red-500">*</span>
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
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="consultationType"
                        value="in-person"
                        checked={formData.consultationType === "in-person"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <Building2
                        size={20}
                        className={
                          formData.consultationType === "in-person"
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={`font-medium ${
                          formData.consultationType === "in-person"
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        In-Person Consultation
                      </span>
                    </label>
                  </div>

                  {/* Conditional Message */}
                  {formData.consultationType === "virtual" && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Video size={20} className="text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">Virtual Consultation</p>
                          <p className="text-sm text-blue-600 mt-1">
                            An online meeting link will be shared with you after confirmation via email.
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
                          <p className="font-medium text-green-800">In-Person Consultation</p>
                          <p className="text-sm text-green-600 mt-1">
                            Visit us at: MediConnect Healthcare Center, 123 Medical Plaza, Suite 456, City - 500001
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01]"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Appointments;
