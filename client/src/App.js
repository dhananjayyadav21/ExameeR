import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ContentState from "./context/ContentState";
import LoadingBar from 'react-top-loading-bar';

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
import PdfViewer from "./services/PdfViewer";
import SearchContent from "./services/SearchContent";
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
import RoleBasedRoute from "./services/RoleBasedRoute";
import ProfileCard from "./components/ProfileCard";
import MyLearning from "./components/MyLearning ";
import UploadNotes from "./Dashbord/components/UploadNotes";
import UploadPYQ from "./Dashbord/components/UploadPYQ";
import UploadVideo from "./Dashbord/components/UploadVideo";
import UploadCourse from "./Dashbord/components/UploadCourse";
import { useState } from "react";
import AddStudent from "./Dashbord/components/AddStudent";
import UpdateStudent from "./Dashbord/components/UpdateStudent";
import UpdatesNotes from "./Dashbord/components/UpdatesNotes";
import UpdatePYQ from "./Dashbord/components/UpdatesPYQ";
import UpdateVideo from "./Dashbord/components/UpdatesVideo";
import EnrollmentPage from "./components/Enrollment";
import PaymentPage from "./components/PymentPage";
import UpdateCourse from "./Dashbord/components/UpdateCourse";

function App() {
  const [progress, setProgress] = useState(0);

  const GoogleAuthWraper = () => {
    return (
      <GoogleOAuthProvider clientId="81360539878-c23jclv7lc31cf8m2remiso4qk6kthd4.apps.googleusercontent.com">
        <Auth setProgress={setProgress}></Auth>
      </GoogleOAuthProvider>
    )
  }

  return (
    <>
      <ContentState>
        <BrowserRouter>
          <Navbar setProgress={setProgress} />
          <LoadingBar color='#04bd20' height={3} progress={progress} onLoaderFinished={() => setProgress(0)} />
          <Routes>
            <Route path="/" element={<Home setProgress={setProgress} />} />

            <Route path="/profile" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<ProfileCard setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/myLearning" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<MyLearning setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/notes" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<Notes setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/cource" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<Cource setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/Q-paper" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<QPaper setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/video" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<Video setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/contact" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<Contact setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/pdfviewer" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<PdfViewer setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/plan-detail" element={<GuardedRoute
              hasToBeAuthenticated={true}
              element={<PaymentPage setProgress={setProgress} />}
              redirectTo="/auth"
            />} />

            <Route path="/searchcontent" element={<SearchContent setProgress={setProgress} />} />
            <Route path="/enrollmentcource" element={<EnrollmentPage setProgress={setProgress} />} />


            {/* Fix: Add '*' to the dashboard route -------------------------------- */}
            <Route path="/dashboard" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<Dashboard />}
              />
            }>
              <Route index element={<DashbordHead />} />
              <Route path="dashboard-head" element={<DashbordHead />} />
              <Route path="dashboard-courses" element={<DashbordCource />} />
              <Route path="dashboard-notes" element={<DashbordNotes />} />
              <Route path="dashboard-videos" element={<DashbordVideo />} />
              <Route path="dashboard-pyq" element={<DashbordPYQ />} />
              <Route path="dashboard-student-management" element={<DashbordStudentManagement />} />
              <Route path="dashboard-analyticst" element={<DashbordAnalytics />} />
              <Route path="dashboard-settings" element={<DashbordSettings />} />
            </Route>

            <Route path="/uploadNotes" element={<RoleBasedRoute
              allowedRoles={["Admin", "Instructor"]}
              element={<UploadNotes />}
            />} />

            <Route path="/uploadPYQ" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UploadPYQ />}
              />
            } />

            <Route path="/uploadVideo" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UploadVideo />}
              />
            } />

            <Route path="/uploadCourse" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UploadCourse />}
              />
            } />

            <Route path="/updatesnotes" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UpdatesNotes />}
              />
            } />

            <Route path="/updatespyq" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UpdatePYQ />}
              />
            } />

            <Route path="/updatesvideo" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UpdateVideo />}
              />
            } />

            <Route path="/updatecourse" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UpdateCourse />}
              />
            } />

            <Route path="/addStudent" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<AddStudent />}
              />
            } />

            <Route path="/updatestudent" element={
              <RoleBasedRoute
                allowedRoles={["Admin", "Instructor"]}
                element={<UpdateStudent />}
              />
            } />


            {/* Authentication Routes */}
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
              element={<VerifyEmail setProgress={setProgress} />}
              redirectTo="/"
            />} />

            <Route path="/forgotPassword" element={<GuardedRoute
              hasToBeAuthenticated={false}
              element={<ForgotPassword setProgress={setProgress} />}
              redirectTo="/"
            />} />
            <Route path="*" element={<ErrorPage setProgress={setProgress} />} />

          </Routes>
        </BrowserRouter>
      </ContentState>
    </>
  );
}

export default App;
