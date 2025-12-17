import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  const highlights = [
    "HIPAA Compliant",
    "24/7 Support",
    "Secure Platform",
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-light px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Trusted by 500+ Healthcare Providers</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Smart Healthcare
              <br />
              <span className="text-gradient">Management</span>
              <br />
              Made Simple
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Streamline patient care with our all-in-one platform. From appointments to telehealth, 
              manage everything in one secure, intuitive dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="lg" className="group">
                Book Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-3xl shadow-elevated p-6 sm:p-8 border border-border/50">
                {/* Dashboard Preview */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Welcome back,</p>
                      <p className="text-lg font-semibold text-foreground">Dr. Sarah Johnson</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">SJ</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Appointments", value: "12" },
                      { label: "Patients", value: "48" },
                      { label: "Consultations", value: "8" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent-light rounded-xl p-4">
                    <p className="text-xs text-accent font-medium mb-1">Next Appointment</p>
                    <p className="text-sm font-semibold text-foreground">10:30 AM</p>
                    <p className="text-xs text-muted-foreground">John Smith</p>
                  </div>
                  <div className="bg-primary-light rounded-xl p-4">
                    <p className="text-xs text-primary font-medium mb-1">Video Call</p>
                    <p className="text-sm font-semibold text-foreground">11:00 AM</p>
                    <p className="text-xs text-muted-foreground">Sarah Lee</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-elevated p-4 border border-border/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Appointment</p>
                    <p className="text-xs text-muted-foreground">Confirmed!</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-elevated p-4 border border-border/50 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">98%</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Satisfaction</p>
                    <p className="text-xs text-muted-foreground">Patient Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
