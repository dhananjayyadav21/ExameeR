import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import Cource from "./components/Cource";
import QPaper from "./components/QPaper";
import Video from "./components/Video";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import Dashboard from "./Dashbord/pages/Dashboard";

import DashbordHead from "./Dashbord/components/DashbordHead";
import DashbordCource from "./Dashbord/components/DashbordCource";
import DashbordNotes from "./Dashbord/components/DashbordNotes";
import DashbordVideo from "./Dashbord/components/DashborVideo";
import DashbordPYQ from "./Dashbord/components/DashbordPYQ";
import DashbordStudentManagement from "./Dashbord/components/StudentManagement";
import DashbordAnalytics from './Dashbord/components/DashbordAnalytics';
import DashbordSettings from './Dashbord/components/DashbordSetting';
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/cource" element={<Cource />} />
          <Route path="/Q-paper" element={<QPaper />} />
          <Route path="/video" element={<Video />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fix: Add '*' to the dashboard route */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashbordHead />} />
            <Route path="dashboard-head" element={<DashbordHead />} />
            <Route path="dashboard-courses" element={<DashbordCource />} />
            <Route path="dashboard-notes" element={<DashbordNotes />} />
            <Route path="dashboard-videos" element={<DashbordVideo />} />
            <Route path="dashboard-pyq" element={<DashbordPYQ />} />
            <Route path="dashboard-student-management" element={<DashbordStudentManagement />}/>
            <Route path="dashboard-analyticst" element={<DashbordAnalytics />} />
            <Route path="dashboard-settings" element={<DashbordSettings />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
