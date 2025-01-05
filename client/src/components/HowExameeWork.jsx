import React from 'react'

const HowExameeWork = () => {
  return (
    <>
      <section id="howItWorks" className="container-lg pt-5">
          <div className="px-lg-4">

            {/* <!-- Section Header --> */}
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-2">How Examee Works</h2>
              <p className="text-secondary">Simple steps to start your learning journey with us</p>
            </div>

            <div className="row my-5">
              {/* <!-- Step 1 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3">
                  <div className="Step-blue mx-auto">
                    <h1 className="fw-bold">1</h1>
                  </div>
                  <h4 className="text-xl font-bold my-2 my-md-4">Choose Your Course</h4>
                  <p className="text-neutral-600">Browse through our wide range of courses and select the one that matches your learning goals.</p>
                </div>
              </div>

              {/* <!-- Step 2 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3">
                  <div className="Step-green mx-auto">
                    <h2 className="fw-bold text-success">2</h2>
                  </div>
                  <h4 className="text-xl font-bold my-2 my-md-4">Access Materials</h4>
                  <p className="text-neutral-600">Get instant access to comprehensive study materials, notes, and video lectures.</p>
                </div>
              </div>

              {/* <!-- Step 3 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3" >
                  <div className="Step-purple mx-auto">
                    <h2 className="fw-bold">3</h2>
                  </div>
                  <h4 className="text-xl font-bold  my-2 my-md-4">Start Learning</h4>
                  <p className="text-neutral-600">Begin your learning journey with structured content and practice materials.</p>
                </div>
              </div>
            </div>

            <div className='container my-5 Feature-examee' >
              <div className="row g-3">
                {/* <!-- Feature 1 --> */}
                <div className="col-md-6 col-lg-3">
                  <div className='shadow-sm rounded-3 border p-3 p-lg-3 bg-light h-100'>
                    <div className="svg-blue mb-4" style={{width:"40px"}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h5 className="font-semibold mb-2">Expert Verified</h5>
                    <p className="text-neutral-600 text-sm">All content verified by subject matter experts</p>
                  </div>
                </div>

                {/* <!-- Feature 2 --> */}
                <div className="col-md-6 col-lg-3">
                <div className='shadow-sm rounded-3 border p-3 p-lg-3 bg-light h-100'>
                  <div className="svg-green mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">Regular Updates</h5>
                  <p className="text-neutral-600 text-sm">Content updated as per latest syllabus</p>
                </div>
                </div>

                {/* <!-- Feature 3 --> */}
                <div className="col-md-6 col-lg-3" >
                <div className=' shadow-sm rounded-3 border p-3 p-lg-3 bg-light h-100'>
                  <div className="svg-purple mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">24/7 Access</h5>
                  <p className="text-neutral-600 text-sm">Learn at your own pace, anytime</p>
                </div>
                </div>

                {/* <!-- Feature 4 --> */}
                <div className="col-md-6 col-lg-3" >
                <div className=' shadow-sm rounded-3 border p-3 p-lg-3 bg-light h-100'>
                  <div className="svg-red mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">Support</h5>
                  <p className="text-neutral-600 text-sm">Get help whenever you need it</p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}

export default HowExameeWork
