import React from 'react'

import { Link } from 'react-router-dom';

const Footer = (props) => {
    return (
        <footer className="mt-auto">
            {/*site map*/}
            <br />
            <section className="mx-5 mt-3">
                <div className="row text-center text-md-start d-flex justify-content-evenly">
                    <div className="col-md-3 text-center">
                        <h5 className="text-uppercase fw-bold">Useful links</h5>

                        <p>
                            <Link to='/profile' className="text-dark text-decoration-none">Your Account</Link>
                        </p>
                        <p>
                            <Link to='/appointments' className="text-dark text-decoration-none">Your Appointments</Link>
                        </p>
                        <p>
                            <Link to='/register' className="text-dark text-decoration-none">Sign Up</Link>
                        </p>
                        <p>
                            <a href="#" className="text-dark text-decoration-none">Help</a>
                        </p>
                    </div>

                    <div className="col-md-3 text-center">
                        <h5 className="text-uppercase fw-bold">Contact</h5>

                        <p>
                            <i className="bi bi-house-fill"></i> Richardson, TX 75080, US
                        </p>

                        <p>
                            <i className="bi bi-envelope-fill"></i> canopy@fakedomain.com
                        </p>

                        <p>
                            <i className="bi bi-telephone-fill"></i> (111) 111-1111
                        </p>
                    </div>
                </div>

                {/*copyright notice*/}
                <div className="text-center p-3">
                    <p className="text-dark">&copy; 2022 Copyright: Canopy Education, LLC</p>
                </div>

            </section>
        </footer>
    );
};

export default Footer;