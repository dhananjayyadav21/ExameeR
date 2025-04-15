import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import Cource from "./components/Cource";
import QPaper from "./components/QPaper";
import Video from "./components/Video";
import Home from "./pages/Home";
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

  const GoogleAuthWraper = ()=>{
    return(
      <GoogleOAuthProvider clientId="81360539878-c23jclv7lc31cf8m2remiso4qk6kthd4.apps.googleusercontent.com">
        <Auth></Auth>
      </GoogleOAuthProvider>
    )
  }

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
          <Route path="/auth" element={<GoogleAuthWraper />} />
          <Route path="/login" element={<GoogleAuthWraper />} />
          <Route path="/register" element={<GoogleAuthWraper />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
