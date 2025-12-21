import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "@/context/AppointmentContext.jsx";
import Index from "./pages/Index.jsx";
import Appointments from "./pages/Appointments.jsx";
import VideoConsultation from "./pages/VideoConsultation.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => (
  <BrowserRouter>
    <AppointmentProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/video-consultation" element={<VideoConsultation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppointmentProvider>
  </BrowserRouter>
);

export default App;
