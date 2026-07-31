import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import RagPage from "./pages/RagPage";
import ImagePage from "./pages/ImagePage";
import SttPage from "./pages/SttPage";
import TtsPage from "./pages/TtsPage";
import VisionPage from "./pages/VisionPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/rag" element={<RagPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/stt" element={<SttPage />} />
        <Route path="/tts" element={<TtsPage />} />
        <Route path="/vision" element={<VisionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;