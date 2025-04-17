import React from "react";

const ProfileCardWithBanner = () => {
    const user = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+91-9876543210",
        avatar: "https://i.pravatar.cc/150?img=15",
        about: "React developer passionate about building modern web applications."
      };

      
  return (
    <div className="container my-5">
      <div className="row bg-white rounded-4 shadow overflow-hidden">
        
        {/* User Details */}
        <div className="col-12 col-md-6 p-4 d-flex flex-column justify-content-center">
          <div className="d-flex align-items-center mb-4">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="rounded-circle me-3 userprofile-img"
            />
            <div>
              <h4 className="mb-1">{user.name}</h4>
              <p className="mb-0 text-muted">{user.email}</p>
              <small className="text-muted">{user.phone}</small>
            </div>
          </div>

          <div>
            <h6 className="fw-semibold">About</h6>
            <p className="text-muted mb-0">{user.about || "No bio provided."}</p>
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
    </div>
  );
};

export default ProfileCardWithBanner;
