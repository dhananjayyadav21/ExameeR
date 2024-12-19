import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import QPaper from "./components/QPaper";
import Video from "./components/Video";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";
import Auth from "./pages/Auth";


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
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />

          <Route path="/" element={<Home />} />
          <Route path="/notes/" element={<Notes />} />
          <Route path="/Q-paper/" element={<QPaper />} />
          <Route path="/video/" element={<Video />} />
          <Route path="/auth/" element={<Auth />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/forgotPassword/" element={<ForgotPassword />} />
          <Route path="/verifyEmail/" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
