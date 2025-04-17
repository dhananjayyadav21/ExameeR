import React from "react";

const ProfileCardWithBanner = () => {
    const user = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        isVerified: "+91-9876543210",
        Profile: "",
        About: ""
      };

      
  return (
    <div className="container p-4">
      <div className="row bg-white rounded-3 shadow overflow-hidden">
        
        {/* User Details d-flex align-items-center d-flex flex-column justify-content-center */}
        <div className="col-12 col-md-6 p-4 ">
          <div className="row d-flex align-items-center">
            <div className="col-12 col-md-3 mb-4 d-flex justify-content-center"> 
              <img
                src={user.Profile || "/assets/img/Avtar.jpg"}
                alt="User Avatar"
                className="rounded-circle me-3 userprofile-img"
              />
              </div>
              <div className="col-12 col-md-9 mb-4">
                <h4 className="mb-1">{user.name}</h4>
                <p className="mb-0 text-muted">{user.email}</p>
                <small className="text-muted">{user.isVerified}</small>
              </div>
          </div>

          <div>
            <h6 className="fw-semibold">About</h6>
            <p className="text-muted mb-0">{user.About || "One lesson at a time, one step closer to greatness."}</p>
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
        <img className="d-flex justify-content-center" src="/assets/img/brandlog.png" alt="Examee" style={{width:"210px"}} />
      </div>
    </div>
  );
};

export default ProfileCardWithBanner;
