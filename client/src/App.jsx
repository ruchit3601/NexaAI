import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import RagPage from "./pages/RagPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/rag" element={<RagPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;