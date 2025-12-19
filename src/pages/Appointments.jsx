import { useState, useEffect } from "react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "lucide-react";
import PersonalInfoSection from "@/components/appointments/PersonalInfoSection.jsx";
import DoctorSelectSection from "@/components/appointments/DoctorSelectSection.jsx";
import AppointmentDetailsSection from "@/components/appointments/AppointmentDetailsSection.jsx";
import AppointmentConfirmation from "@/components/appointments/AppointmentConfirmation.jsx";
import { specializations, doctorsBySpecialization, timeSlots, generateAppointmentNumber } from "@/data/appointmentData.js";
import { validateForm, isFormValid } from "@/utils/validation.js";

const initialFormState = {
  patientName: "",
  phone: "",
  email: "",
  age: "",
  specialization: "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationMode: "",
};

const Appointments = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  // Update doctors when specialization changes
  useEffect(() => {
    if (formData.specialization) {
      setAvailableDoctors(doctorsBySpecialization[formData.specialization] || []);
      setFormData((prev) => ({ ...prev, doctor: "" }));
    }
  }, [formData.specialization]);

  // Validate form on every change
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      return;
    }

    const selectedDoctor = availableDoctors.find((d) => d.id === formData.doctor);

    setConfirmationData({
      appointmentNumber: generateAppointmentNumber(),
      patientName: formData.patientName,
      doctorName: selectedDoctor?.name || "",
      date: formatDate(formData.appointmentDate),
      time: formData.appointmentTime,
      mode: formData.consultationMode === "virtual" ? "Virtual Consultation" : "In-Person Visit",
      specialization: formData.specialization,
    });
    setIsSubmitted(true);
  };

  const handleNewAppointment = () => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setConfirmationData(null);
    setAvailableDoctors([]);
  };

  const formIsValid = isFormValid(validateForm(formData));
  const visibleErrors = Object.keys(errors).reduce((acc, key) => {
    acc[key] = touched[key] ? errors[key] : "";
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-light px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Book Your Visit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Schedule an <span className="text-gradient">Appointment</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Book your consultation with our expert healthcare professionals in just a few steps.
            </p>
          </div>

          {!isSubmitted ? (
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-elevated border border-border/50 p-6 sm:p-10">
                <div className="grid gap-8">
                  <PersonalInfoSection
                    formData={formData}
                    errors={visibleErrors}
                    onChange={handleChange}
                  />

                  <div className="border-t border-border" />

                  <DoctorSelectSection
                    formData={formData}
                    errors={visibleErrors}
                    onChange={handleChange}
                    specializations={specializations}
                    availableDoctors={availableDoctors}
                  />

                  <div className="border-t border-border" />

                  <AppointmentDetailsSection
                    formData={formData}
                    errors={visibleErrors}
                    onChange={handleChange}
                    timeSlots={timeSlots}
                  />

                  <Button type="submit" size="lg" className="w-full" disabled={!formIsValid}>
                    Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <AppointmentConfirmation
              confirmationData={confirmationData}
              onNewAppointment={handleNewAppointment}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
