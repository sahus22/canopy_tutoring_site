import React from 'react'
import { Link } from 'react-router-dom'

import { Search } from 'react-bootstrap-icons';

const circleStyle = {
    width: '2em',
    height: '2em',
    background: 'white',
    borderRadius: '70px'
}

const Header = () => {

    const [auth, setAuth] = React.useState(null)

    React.useEffect(() => {
        setAuth(JSON.parse(localStorage.getItem('user')))
        window.addEventListener('authenticate', () => {
            setAuth(JSON.parse(localStorage.getItem('user')))
        })
    }, [])

    console.log(auth)

    const profileElement = auth && auth.user_id
        ? <Link className='nav-link' to="/profile">{auth.username}</Link>
        : <Link className="nav-link" to="/login">Login</Link>

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-custom ">
                <div className="container-fluid">
                    <Link className='navbar-brand' to='/'>Canopy <img src="images/canopy_logo.png" style={circleStyle} alt="logo"/></Link>

                    {/*general search bar*/}
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <form className="d-flex">
                                <input className="form-control" type="search" placeholder="Search"></input>
                                <button className="btn btn-custom" type="submit"><Search /></button>
                            </form>
                        </li>

                        {/*Find a Tutor button*/}
                        <li className="nav-item">
                            <Link className="nav-link" to="/tutors">Find a Tutor</Link>
                        </li>

                        {/*My Appointments button*/}
                        <li className="nav-item">
                            <Link className="nav-link" to='/appointments'>My Appointments</Link>
                        </li>

                        {/*login / profile*/}
                        <li className="nav-item">
                            {profileElement}
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;