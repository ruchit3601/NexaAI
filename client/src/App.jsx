import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import RagPage from "./pages/RagPage";
import ImagePage from "./pages/ImagePage";
import SttPage from "./pages/SttPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/rag" element={<RagPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/stt" element={<SttPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;