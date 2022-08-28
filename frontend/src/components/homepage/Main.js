import React from 'react'
import './Main.css'

import { Link } from 'react-router-dom';

import { StopwatchFill, BookHalf, Tools, InfoCircleFill } from 'react-bootstrap-icons';

const Main = (props) => {
    /* Splash page jumbotron with mission statement */
    return (
        <div className="container-fluid py-5 text-center">
    
            <h1 className="display-5 fw-bold">Canopy: we've got you covered</h1>
    
            <p className="fs-4 mb-5">
                Canopy is an all in one platform for connecting students with tutors.
            </p>
    
            {/* GET STARTED menus */}
            <div className="row" style={{marginBottom:'5%'}}>
                {/* I'm a Student */}
                <div className="col-md-2 offset-md-3 ">
                    <div className="card bg-green text-white">
                        <div className="card-body">
                            <h5 className="card-title">I'm a Student</h5>
                            <p className="card-text">Choose a subject and build mastery</p>
                            <Link to="/register" className="btn btn-custom">Get Started!</Link>
                        </div>
                    </div>
                </div>
    
                {/* I'm a Tutor */}
                <div className="col-md-2 offset-md-2">
                    <div className="card bg-green text-white">
                        <div className="card-body">
                            <h5 className="card-title">I'm a Tutor</h5>
                            <p className="card-text">Set up a profile and connect with students</p>
                            <Link to="/register" className="btn btn-custom">Get Started!</Link>
                        </div>
                    </div>
                </div>
            </div>
    
            <hr className="border-2 mb-5" style={{width:'70%', margin:'auto'}}></hr>
    
            {/* Nav Row 1 */}
            <div className="row d-flex justify-content-center" style={{marginBottom:'5%'}}>
                {/* How Canopy Works row */} 
                <h2 className="card-title mb-3"> How Canopy Works</h2>
                <div className="col-md-3">
                    <div className="card bg-green text-white">
                        <div className="card-body">
                            <h5 className="card-title">1. Request</h5>
                            <p className="card-text">Tell us what you need help with and
                                 our smart matching system will connect you with an 
                                 online tutor.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="card bg-green text-white">
                        <div className="card-body">
                            <h5 className="card-title">2. Learn</h5>
                            <p className="card-text">Get live 1-on-1 help in our advanced
                                lesson space. Use a virtual whiteboard,
                                audio/video chat, screen sharing, text
                                editor and much more.</p>
                        </div>
                    </div>
                </div>
    
                <div className="col-md-3">
                    <div className="card bg-green text-white">
                        <div className="card-body">
                            <h5 className="card-title">3. Review</h5>
                            <p className="card-text">After the lesson is completed, both the
                                tutor and student have the opportunity to
                                rate each other, maintaining the quality of
                                our community.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Nav Row 2 */}
            <div className="row" style={{marginBottom:'5%'}}>
                {/* Why Use Canopy row*/}
                    <h2 className="card-title"> Why use Canopy?</h2>
                    <div className = "col-md-3 offset-md-3">
                        <div className="card-body">
                            <h5 className="card-title">On-demand tutoring</h5>
                            <StopwatchFill />
                            <p className="card-text">Connect with an online tutor in less than 30
                                seconds, 24/7. It doesn’t matter if you want help with
                                a single problem or you need a 3-hour lesson.</p>
                        </div>
                    </div>
    
                    <div className="col-md-3">
                        <div className="card-body">
                            <h5 className="card-title">Learn from the best tutors</h5>
                            <BookHalf />
                            <p className="card-text">Highly qualified tutors from the best universities
                                across the globe ready to help. An acceptance rate
                                of 4% means all our tutors are thoroughly screened.</p>
                        </div>                    
                    </div>
    
                    <div className="w-100"></div>
    
                    <div className="col-md-3 offset-md-3">
                        <div className="card-body">
                            <h5 className="card-title">All the tools you need</h5>
                            <Tools />
                            <p className="card-text">Our lesson space features a virtual whiteboard, text
                                editor, audio/video chat, screensharing and so much
                                more. All lessons are archived for your convenience.</p>
                        </div>                    
                    </div>
    
                    <div className="col-md-3">
                        <div className="card-body">
                            <h5 className="card-title">Get help in any subject</h5>
                            <InfoCircleFill />
                            <p className="card-text">We cover over 300 subjects across all grade levels.
                                Whether it’s high school algebra or college-level
                                Spanish, we have a tutor that can help.</p>
                        </div>                    
                    </div>      
            </div>
        </div>
    );
};

export default Main;