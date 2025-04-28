import React, { useEffect } from 'react'
import CourceIteam from './CourceIteam'
import Footer from './Footer'

const Cource = ({ setProgress }) => {

  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const dummyCourses = [
    {
      id: 1,
      title: "C Programming",
      level: "Beginner",
      duration: "10 weeks",
      content: "OOPs, Variables, Identifiers, Keywords, Looping, Control Statements",
      thumbnail: "/assets/img/C-Programming-Courses.png",
      offer: "50%",
      lectures: [
        { title: 'Introduction to C', duration: '30 mins' },
        { title: 'Variables and Data Types', duration: '45 mins' },
        { title: 'Control Structures in C', duration: '50 mins' },
        { title: 'Functions in C', duration: '40 mins' },
        { title: 'Arrays and Pointers', duration: '60 mins' },
      ]
    },
    {
      id: 2,
      title: "Python for Data Science",
      level: "Intermediate",
      duration: "8 weeks",
      content: "Numpy, Pandas, Data Cleaning, Data Visualization, ML Basics",
      thumbnail: "/assets/img/python-cource.jpg",
      offer: "80%",
      lectures: [
        { title: 'Introduction to Python', duration: '35 mins' },
        { title: 'Working with Numpy', duration: '50 mins' },
        { title: 'Data Analysis with Pandas', duration: '60 mins' },
        { title: 'Data Visualization Basics', duration: '45 mins' },
        { title: 'Intro to Machine Learning', duration: '70 mins' },
      ]
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      level: "Beginner",
      duration: "12 weeks",
      content: "HTML, CSS, JavaScript, Bootstrap, React.js",
      thumbnail: "/assets/img/webdev-cource.png",
      offer: "40%",
      lectures: [
        { title: 'HTML Basics', duration: '50 mins' },
        { title: 'CSS Styling', duration: '40 mins' },
        { title: 'JavaScript Fundamentals', duration: '60 mins' },
        { title: 'Responsive Web Design with Bootstrap', duration: '55 mins' },
        { title: 'Introduction to React.js', duration: '75 mins' },
      ]
    },
    {
      id: 4,
      title: "Java Fullstack Development",
      level: "Advanced",
      duration: "14 weeks",
      content: "Core Java, Spring Boot, Hibernate, REST APIs, React.js",
      thumbnail: "/assets/img/java-cource.jpg",
      offer: "70%",
      lectures: [
        { title: 'Java Basics', duration: '50 mins' },
        { title: 'Object-Oriented Programming with Java', duration: '65 mins' },
        { title: 'Spring Boot Introduction', duration: '70 mins' },
        { title: 'Working with Hibernate', duration: '60 mins' },
        { title: 'Building REST APIs', duration: '80 mins' },
      ]
    }
  ];
  


  return (
    <>

      <div className='Course-header'>
        <div className='container-lg p-3'>
          <p className='my-3'> Your Cources   <span><i className="fa-solid fa-laptop-code"></i> Enroll Courses</span></p>
          <h5 className='my-3'>Discover Your Courses online</h5>
          <p>Explore Web Development courses that cover skills in HTML, CSS, JavaScript, and responsive design. Build expertise for careers in front-end development, full-stack development, and web design.</p>
        </div>
      </div>

      <div className="container-fluid ">
        <div className="row g-4">
          {/*=========================================== left container ===========================================*/}
          <div className="col-12 col-md-2 sidebar-CoursesSection">
            <div className='px-2 my-4 rounded-3'>
              <h5>Filter Courses</h5>
              <div className='row g-2 px-2 rounded-3' >
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="FreeCourses" />
                  <label className="form-check-label" htmlFor="FreeCourses">
                    Free Courses
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="PaidCourses" />
                  <label className="form-check-label" htmlFor="PaidCourses">
                    Paid Courses
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/*=========================================== right container ===========================================*/}
          <div className="col-12 col-md-10 main-CoursesSection">
            <div className="px-2 py-4">
              {/*========= Cource Section =============*/}
              <div className="my-md-4 d-sm-flex justify-content-between">
                <div className='my-4 my-sm-0'><h5>Explore the Web Development Courses</h5> </div>
                <div className="col-3 col-sm-2 text-center">
                  <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Sort By <i className="fa-solid fa-sort"></i>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="/cource">oldest</a></li>
                    <li><a className="dropdown-item" href="/cource">latest</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <div className="row g-4">
                  {dummyCourses.map((e, index) => <CourceIteam key={index} data={e} />)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ====================================== footer ================================================================= */}
      <footer className="footer bottom-0">
        <Footer />
      </footer>

    </>
  )
}

export default Cource
