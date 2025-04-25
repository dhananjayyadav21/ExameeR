import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as GlobalUrls from "../GlobalURL"

const ProfileCardWithBanner = ({setProgress}) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState("");

  useEffect(() => {
    setProgress(0);
    if (token) {
      getUser();
    } else {
      navigate("/login");
    }
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const getUser = async()=>{
    try {
      const response = await fetch(`${GlobalUrls.GETUSER_URL}`, { //call server api 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AuthToken": localStorage.getItem("token")
          },
      });
      const result = await response.json(); // get response from server
      setUser(result.user);      
    } catch (error) {
      console.error("getUser error:", error.message);
    }
  }
  
  return (
    <div className="container p-4">
      <div className="row bg-white rounded-3 shadow overflow-hidden">
        
        {/* User Details d-flex align-items-center d-flex flex-column justify-content-center */}
        <div className="col-12 col-md-6 p-4 ">
          <div className="row d-flex align-items-center">
            <div className="col-12 col-md-3 mb-4 d-flex justify-content-center"> 
              <img
                src={localStorage.getItem("Profile") && localStorage.getItem("Profile") !== "undefined"
                  ? localStorage.getItem("Profile")
                  : "/assets/img/Avtar.jpg"}
                alt="User Avatar"
                className="rounded-circle me-3 userprofile-img"
              />
              </div>
              <div className="col-12 col-md-9 mb-4">
                <h4 className="mb-1">@{user?.Username}</h4>
                <p className="mb-0 text-muted">{user?.Email}</p>
                {user.isVerified ?
                  <><small className="text-success">Verified <i className="fas fa-check-circle text-success"></i></small></>:
                  <><small className="text-danger">Not Verified <i className="fas fa-times-circle text-danger"></i></small></>
                }
              </div>
          </div>

          <div>
            <h6 className="fw-semibold">About</h6>
            <p className="text-muted mb-0">{user?.About || "One lesson at a time, one step closer to greatness."}</p>
          </div>
        </div>

        {/* Book Banner */}
        <div className="col-12 col-md-6 p-0 banner-container">
          <img
            src="https://www.gstatic.com/classroom/themes/img_bookclub.jpg"
            alt="Books Banner"
            className="img-fluid h-100 w-100 banner-image"
          />
        </div>
      </div>

      <div className="d-flex justify-content-center my-5">
        <img className="d-flex justify-content-center" src="/assets/img/brandlog.png" alt="Examee" style={{width:"150px"}} />
      </div>
    </div>
  );
};

export default ProfileCardWithBanner;
