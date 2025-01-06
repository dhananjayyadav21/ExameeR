import React from "react";
import { Routes, Route } from "react-router-dom";
import DashbordHead from "../components/DashbordHead";
import Cource from "../components/DashbordCource";
import Notes from "../components/DashbordNotes";
import Video from "../components/DashborVideo";
import PYQ from "../components/DashbordPYQ";
import StudentManagement from "../components/StudentManagement";
import Settings from "../components/DashbordSetting";
import Analytics from "../components/DashbordAnalytics";
import Sidebar from "../components/DashbordSidebar";
import MobileMenuButton from "../components/DashbordMobileBar";

// import UploadForm from "../components/UplodeFiles";

const Dashboard = () => {
  return (
    <>
      <div className="container-fluid cursor-default">
        <div className="row">
          <section className="dashbor-nav col-lg-2 d-none d-lg-flex p-0">
             <Sidebar/>
          </section>

          <section className="dashbor-main col-12 col-lg-10 p-0">
            <section className="components">
              <div className="bg-light">
                <Routes>
                  <Route index element={<DashbordHead />} /> 

                  {/* Dashboard Head */}
                  <Route path="/dashboard-head" element={<DashbordHead />} />

                  {/* Courses */}
                  <Route path="/dashboard-courses" element={<Cource />} />

                  {/* Notes */}
                  <Route path="/dashboard-notes" element={<Notes />} />

                  {/* Videos */}
                  <Route path="/dashboard-videos" element={<Video />} />

                  {/* Previous Year Questions */}
                  <Route path="/dashboard-pyq" element={<PYQ />} />

                  {/* Student Management */}
                  <Route path="/dashboard-student-management" element={<StudentManagement />} />
                </Routes>
              </div>
              <div className="bg-darkgray">
                <Routes>
                  {/* Analytics */}
                  <Route path="/dashboard-analyticst" element={<Analytics />} />

                  {/* Settings */}
                  <Route path="/dashboard-settings" element={<Settings />} />
                </Routes>
              </div>
            </section>


            <section className="position-relative d-lg-none">
              <MobileMenuButton/>
            </section>
          </section>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
