import React from "react";
import DashbordHead from "../components/DashbordHead";
import Cource from "../components/DashbordCource";
import Notes from "../components/DashbordNotes";
import Video from "../components/DashborVideo";
import PYQ from "../components/DashbordPYQ";
import StudentManagement from "../components/StudentManagement";
import Settings from "../components/DashbordSetting";
import Analytics from "../components/DashbordAnalytics";
import Sidebar from "../components/DashbordSidebar";

const Dashboard = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <section className="dashbor-nav col-lg-2 p-0">
             <Sidebar/>
          </section>
          <section className="dashbor-main col-12 col-lg-10 p-0">
            <div className=" bg-light">
              {/* Dashbord Head */}
              <div className="container-lg py-2 ">
                <DashbordHead />
              </div>

              {/* dashbord Cource  */}
              <div className="container-lg py-2">
                <Cource />
              </div>

              {/* dashbord Notes  */}
              <div className="container-lg py-2">
                <Notes />
              </div>

              {/* dashbord Video  */}
              <div className="container-lg py-2">
                <Video />
              </div>

              {/* dashbord PYQ  */}
              <div className="container-lg py-2">
                <PYQ />
              </div>

              {/* dashbord StudentManagement  */}
              <div className="container-lg py-2">
                <StudentManagement />
              </div>
            </div>

            <div className="bg-darkgray">
              {/* dashbord Analytics  */}
              <div className="py-2">
                <Analytics />
              </div>

              {/* dashbord Setting  */}
              <div className="py-2">
                <Settings />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
