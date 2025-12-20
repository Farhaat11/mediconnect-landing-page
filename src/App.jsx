import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Appointments from "./pages/Appointments.jsx";
import VideoConsultation from "./pages/VideoConsultation.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/video-consultation" element={<VideoConsultation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
