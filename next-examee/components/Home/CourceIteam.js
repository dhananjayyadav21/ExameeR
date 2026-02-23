"use client";
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import ContentContext from '../../context/ContentContext'

const CourceIteam = ({ Course }) => {
    const router = useRouter();
    const { setSelectedCourse } = useContext(ContentContext);

    const handleEnroll = (course) => {
        setSelectedCourse(course);
        router.push("/enrollmentcource");
    };

    const handleWatchCourse = (course) => {
        setSelectedCourse(course);
        router.push("/WatchCourse");
    };

    return (
        <>
            <div className="col-12 col-sm-6 col-lg-3">
                <div className="card card-transition shadow-sm Courses-item my-3 p-2 rounded-3" style={{ minHeight: "380px" }}>
                    <div className='position-relative' style={{ minHeight: "150px" }}>
                        <img className="card-img-top rounded-3" src={Course?.courseImage ? `https://lh3.googleusercontent.com/d/${Course?.courseImage}` : "/assets/img/cource.jpg"} alt="" style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover"
                        }} />
                        {!Course?.isEnrolled && (<span className='badge bg-warning cource-offer-badge'>{Course?.offerPercent}% off</span>)}
                    </div>
                    <div className="card-body pb-0 px-1">
                        <div className='d-flex justify-content-between align-items-center py-2'>
                            <span className="badge-blue px-2 py-1 rounded-2">{Course?.courseLevel}</span>
                            <span>Duration:{Course?.duration}</span>
                        </div>
                        <h5 className="card-title px-0">{Course?.title}</h5>
                        <div className="card-text px-0"><span>Course Content :{(Course?.courseContents)?.slice(0, 50)}...</span></div>
                        {
                            Course?.isEnrolled ?
                                <><button className='btn btn-primary text-white fw-bold col-12 m-0' onClick={() => handleWatchCourse(Course)}>Let's Study</button></> :
                                <><button className='btn btn-info text-white fw-bold col-12 m-0' onClick={() => handleEnroll(Course)}>Enrolled Now</button></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourceIteam
