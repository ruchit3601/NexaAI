import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import RagPage from "./pages/RagPage";
import ImagePage from "./pages/ImagePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/rag" element={<RagPage />} />
        <Route path="/image" element={<ImagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;