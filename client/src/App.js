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
import GuardedRoute from "./services/GuardedRoute";
import ProfileCard from "./components/ProfileCard";
import MyLearning from "./components/MyLearning ";
import UploadNotes from "./Dashbord/components/UploadNotes";
import UploadPYQ from "./Dashbord/components/UploadPYQ";
import UploadVideo from "./Dashbord/components/UploadVideo";
import UploadCourse from "./Dashbord/components/UploadCourse";

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

          <Route path="/profile" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<ProfileCard />}
            redirectTo="/auth"
          />} />

          <Route path="/myLearning" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<MyLearning />}
            redirectTo="/auth"
          />} />

          <Route path="/notes" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<Notes />}
            redirectTo="/auth"
          />} />

          <Route path="/cource" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<Cource />}
            redirectTo="/auth"
          />} />

          <Route path="/Q-paper" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<QPaper />}
            redirectTo="/auth"
          />}/>

          <Route path="/video" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<Video />}
            redirectTo="/auth"
          />} />

          <Route path="/contact" element={<GuardedRoute
            hasToBeAuthenticated={true}
            element={<Contact />}
            redirectTo="/auth"
          />} />



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

          <Route path="/uploadNotes" element={<UploadNotes />} />
          <Route path="/uploadPYQ" element={<UploadPYQ />} />
          <Route path="/uploadVideo" element={<UploadVideo />} />
          <Route path="/uploadCourse" element={<UploadCourse />} />

          {/* Authentication Routes */}
          <Route path="/auth" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<GoogleAuthWraper />}
            redirectTo="/"
          />} />

          <Route path="/auth" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<GoogleAuthWraper />}
            redirectTo="/"
          />} />

          <Route path="/login" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<GoogleAuthWraper />}
            redirectTo="/"
          />} />

          <Route path="/register" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<GoogleAuthWraper />}
            redirectTo="/"
          />} />

          <Route path="/verifyEmail" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<VerifyEmail />}
            redirectTo="/"
          />} />

          <Route path="/forgotPassword" element={<GuardedRoute
            hasToBeAuthenticated={false}
            element={<ForgotPassword />}
            redirectTo="/"
          />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
