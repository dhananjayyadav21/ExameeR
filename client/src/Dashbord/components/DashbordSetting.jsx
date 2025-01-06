import React from 'react';

const Settings = () => {
  return (
    <section id="settings" className="min-vh-100 bg-darkgray text-white p-lg-4">
      <div className="container">
        {/* Profile Settings */}
        <div className="bg-dark rounded-3 border border-dark p-4 mb-4">
          <h2 className="h5 font-weight-bold mb-4">Profile Settings</h2>

          <div className="d-flex justify-content-start align-items-center gap-3 mb-4">
            <div
              className="rounded-circle overflow-hidden mr-3 border border-light"
              style={{ width: '96px', height: '96px' }}
            >
              <img
                src="https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg"
                alt="Profile"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            <div>
              <button className="btn btn-secondary mr-2">
                <i className="fas fa-camera"></i> Change Photo
              </button>
              <button className="btn btn-link text-danger">
                <i className="fas fa-trash-alt"></i> Remove
              </button>
            </div>
          </div>

          <form>
            <div className="form-row">
              <div className="form-group mb-2 col-md-6">
                <label className="">First Name</label>
                <input
                  type="text"
                  className="form-control placeholder-white bg-dark text-white border border-secondary"
                  placeholder="First Name"
                />
              </div>
              <div className="form-group mb-2 col-md-6">
                <label className="">Last Name</label>
                <input
                  type="text"
                  className="form-control placeholder-white bg-dark text-white border border-secondary"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="form-group mb-2">
              <label className="">Email</label>
              <input
                type="email"
                className="form-control placeholder-white bg-dark text-white border border-secondary"
                placeholder="Email"
              />
            </div>

            <div className="form-group mb-2">
              <label className="">Institution</label>
              <input
                type="text"
                className="form-control placeholder-white bg-dark text-white border border-secondary"
                placeholder="Institution"
              />
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-dark rounded-3 border border-dark p-4 mb-4">
          <h2 className="h5 font-weight-bold mb-4">Security Settings</h2>
          <form>
            <div className="form-group mb-2">
              <label className="">Current Password</label>
              <input
                type="password"
                className="form-control placeholder-white bg-dark text-white border border-secondary"
                placeholder="Current Password"
              />
            </div>

            <div className="form-group mb-2">
              <label className="">New Password</label>
              <input
                type="password"
                className="form-control placeholder-white bg-dark text-white border border-secondary"
                placeholder="New Password"
              />
            </div>

            <div className="form-group mb-2">
              <label className="">Confirm New Password</label>
              <input
                type="password"
                className="form-control placeholder-white bg-dark text-white border border-secondary"
                placeholder="Confirm New Password"
              />
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-dark rounded-3 border border-dark p-4 mb-4">
          <h2 className="h5 font-weight-bold mb-4">Notification Preferences</h2>
          <div className="mb-3">
            <div className="d-flex justify-content-between py-2 border-bottom border-dark">
              <div>
                <h5 className="font-weight-semibold">New Course Notifications</h5>
                <p className=" small">
                  Receive notifications when new courses are added
                </p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="newCourseNotifications"
                />
              </div>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom border-dark">
              <div>
                <h5 className="font-weight-semibold">Notes Updates</h5>
                <p className=" small">
                  Get notified about new study materials
                </p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notesUpdates"
                />
              </div>
            </div>

            <div className="d-flex justify-content-between py-2">
              <div>
                <h5 className="font-weight-semibold">Video Lecture Alerts</h5>
                <p className=" small">Receive alerts for new video content</p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="videoLectureAlerts"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-secondary mr-2">Cancel</button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
