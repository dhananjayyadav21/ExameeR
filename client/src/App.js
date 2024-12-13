import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import QPaper from "./components/QPaper";
import Video from "./components/Video";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/Q-paper" element={<QPaper />} />
          <Route path="/video" element={<Video />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
