import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Clock, User, Phone, Mail, Stethoscope, Calendar, Video, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// Validation schema
const appointmentSchema = z.object({
  patientName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets and spaces allowed"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Only numeric values allowed"),
  email: z.string().email("Please enter a valid email address"),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Age must be a number")
    .refine((val) => Number(val) >= 1 && Number(val) <= 120, "Age must be between 1 and 120"),
  specialization: z.string().min(1, "Please select a specialization"),
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentDate: z.date({ required_error: "Please select a date" }),
  appointmentTime: z.string().min(1, "Please select a time slot"),
  consultationMode: z.enum(["virtual", "in-person"], {
    required_error: "Please select consultation mode",
  }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Mock data
const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "General Medicine",
];

const doctorsBySpecialization: Record<string, { id: string; name: string; experience: string }[]> = {
  Cardiology: [
    { id: "c1", name: "Dr. Sarah Johnson", experience: "15 years" },
    { id: "c2", name: "Dr. Michael Chen", experience: "12 years" },
  ],
  Dermatology: [
    { id: "d1", name: "Dr. Emily Davis", experience: "10 years" },
    { id: "d2", name: "Dr. Robert Wilson", experience: "8 years" },
  ],
  Neurology: [
    { id: "n1", name: "Dr. James Anderson", experience: "20 years" },
    { id: "n2", name: "Dr. Lisa Brown", experience: "14 years" },
  ],
  Orthopedics: [
    { id: "o1", name: "Dr. David Miller", experience: "18 years" },
    { id: "o2", name: "Dr. Jennifer Taylor", experience: "11 years" },
  ],
  Pediatrics: [
    { id: "p1", name: "Dr. Amanda White", experience: "13 years" },
    { id: "p2", name: "Dr. Christopher Lee", experience: "9 years" },
  ],
  Psychiatry: [
    { id: "ps1", name: "Dr. Rachel Green", experience: "16 years" },
    { id: "ps2", name: "Dr. Mark Thompson", experience: "12 years" },
  ],
  "General Medicine": [
    { id: "g1", name: "Dr. Nancy Clark", experience: "22 years" },
    { id: "g2", name: "Dr. Kevin Martinez", experience: "10 years" },
  ],
};

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

interface ConfirmationData {
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  mode: string;
  specialization: string;
}

const Appointments = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<{ id: string; name: string; experience: string }[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
  });

  const selectedSpecialization = watch("specialization");
  const selectedDate = watch("appointmentDate");

  useEffect(() => {
    if (selectedSpecialization) {
      setAvailableDoctors(doctorsBySpecialization[selectedSpecialization] || []);
      setValue("doctor", "");
    }
  }, [selectedSpecialization, setValue]);

  const generateAppointmentNumber = () => {
    return `MC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  };

  const onSubmit = (data: AppointmentFormData) => {
    const selectedDoctor = availableDoctors.find((d) => d.id === data.doctor);
    
    setConfirmationData({
      appointmentNumber: generateAppointmentNumber(),
      patientName: data.patientName,
      doctorName: selectedDoctor?.name || "",
      date: format(data.appointmentDate, "PPPP"),
      time: data.appointmentTime,
      mode: data.consultationMode === "virtual" ? "Virtual Consultation" : "In-Person Visit",
      specialization: data.specialization,
    });
    setIsSubmitted(true);
  };

  const handleNewAppointment = () => {
    reset();
    setIsSubmitted(false);
    setConfirmationData(null);
    setAvailableDoctors([]);
  };

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
              <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-3xl shadow-elevated border border-border/50 p-6 sm:p-10">
                <div className="grid gap-8">
                  {/* Personal Information Section */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Patient Name */}
                      <div className="space-y-2">
                        <Label htmlFor="patientName" className="text-foreground font-medium">
                          Patient Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="patientName"
                            placeholder="Enter full name"
                            className={cn(
                              "pl-10",
                              errors.patientName && "border-destructive focus-visible:ring-destructive"
                            )}
                            {...register("patientName")}
                          />
                        </div>
                        {errors.patientName && (
                          <p className="text-sm text-destructive">{errors.patientName.message}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="10-digit number"
                            maxLength={10}
                            className={cn(
                              "pl-10",
                              errors.phone && "border-destructive focus-visible:ring-destructive"
                            )}
                            {...register("phone")}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className={cn(
                              "pl-10",
                              errors.email && "border-destructive focus-visible:ring-destructive"
                            )}
                            {...register("email")}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Age */}
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-foreground font-medium">
                          Age <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="age"
                          placeholder="Enter age (1-120)"
                          className={cn(
                            errors.age && "border-destructive focus-visible:ring-destructive"
                          )}
                          {...register("age")}
                        />
                        {errors.age && (
                          <p className="text-sm text-destructive">{errors.age.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Doctor Selection Section */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      Select Doctor
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Specialization */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-medium">
                          Specialization <span className="text-destructive">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValue("specialization", value, { shouldValidate: true })}>
                          <SelectTrigger className={cn(errors.specialization && "border-destructive")}>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializations.map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.specialization && (
                          <p className="text-sm text-destructive">{errors.specialization.message}</p>
                        )}
                      </div>

                      {/* Doctor */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-medium">
                          Doctor <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => setValue("doctor", value, { shouldValidate: true })}
                          disabled={!selectedSpecialization}
                        >
                          <SelectTrigger className={cn(errors.doctor && "border-destructive")}>
                            <SelectValue placeholder={selectedSpecialization ? "Select doctor" : "Select specialization first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDoctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                <div className="flex flex-col">
                                  <span>{doctor.name}</span>
                                  <span className="text-xs text-muted-foreground">{doctor.experience} experience</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.doctor && (
                          <p className="text-sm text-destructive">{errors.doctor.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Appointment Details Section */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Appointment Details
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Date Picker */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-medium">
                          Appointment Date <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground",
                                errors.appointmentDate && "border-destructive"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => setValue("appointmentDate", date as Date, { shouldValidate: true })}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.appointmentDate && (
                          <p className="text-sm text-destructive">{errors.appointmentDate.message}</p>
                        )}
                      </div>

                      {/* Time Slot */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-medium">
                          Time Slot <span className="text-destructive">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValue("appointmentTime", value, { shouldValidate: true })}>
                          <SelectTrigger className={cn(errors.appointmentTime && "border-destructive")}>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.appointmentTime && (
                          <p className="text-sm text-destructive">{errors.appointmentTime.message}</p>
                        )}
                      </div>

                      {/* Consultation Mode */}
                      <div className="sm:col-span-2 space-y-3">
                        <Label className="text-foreground font-medium">
                          Mode of Consultation <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup
                          onValueChange={(value) => setValue("consultationMode", value as "virtual" | "in-person", { shouldValidate: true })}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <Label
                            htmlFor="virtual"
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                              "hover:border-primary/50 hover:bg-primary-light/50",
                              watch("consultationMode") === "virtual"
                                ? "border-primary bg-primary-light"
                                : "border-border"
                            )}
                          >
                            <RadioGroupItem value="virtual" id="virtual" />
                            <Video className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">Virtual</p>
                              <p className="text-sm text-muted-foreground">Video consultation</p>
                            </div>
                          </Label>
                          <Label
                            htmlFor="in-person"
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                              "hover:border-primary/50 hover:bg-primary-light/50",
                              watch("consultationMode") === "in-person"
                                ? "border-primary bg-primary-light"
                                : "border-border"
                            )}
                          >
                            <RadioGroupItem value="in-person" id="in-person" />
                            <Building2 className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">In-Person</p>
                              <p className="text-sm text-muted-foreground">Visit the clinic</p>
                            </div>
                          </Label>
                        </RadioGroup>
                        {errors.consultationMode && (
                          <p className="text-sm text-destructive">{errors.consultationMode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!isValid}
                  >
                    Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmation UI */
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-3xl shadow-elevated border border-border/50 p-8 sm:p-12 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Appointment Confirmed!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your appointment has been successfully scheduled.
                </p>

                {/* Appointment Details Card */}
                {confirmationData && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 mb-8 text-left">
                    {/* Appointment Number */}
                    <div className="text-center mb-6 pb-6 border-b border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Appointment Number</p>
                      <p className="text-2xl font-bold text-primary">{confirmationData.appointmentNumber}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Patient Name</p>
                          <p className="font-semibold text-foreground">{confirmationData.patientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Doctor</p>
                          <p className="font-semibold text-foreground">{confirmationData.doctorName}</p>
                          <p className="text-sm text-primary">{confirmationData.specialization}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-semibold text-foreground">{confirmationData.date}</p>
                          <p className="text-primary">{confirmationData.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Consultation Mode</p>
                          <div className="flex items-center gap-2">
                            {confirmationData.mode === "Virtual Consultation" ? (
                              <Video className="w-4 h-4 text-primary" />
                            ) : (
                              <Building2 className="w-4 h-4 text-primary" />
                            )}
                            <p className="font-semibold text-foreground">{confirmationData.mode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleNewAppointment}>
                    Book Another Appointment
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/">Return to Home</a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
