import React from 'react';

import { useNavigate, Link } from 'react-router-dom';

const Login = (props) => {

    // form state variables
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    // workflow state variables
    const [error, setError] = React.useState('')

    const navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();

        // attempt to log in
        // handle api error
        // on success, grant auth token and redirect to profile page
        fetch('/api/user_auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify( {
                "username": username,
                "password": password
            })
        })
        .then( response => {
            if (!response.ok) throw new Error(response.status)
            else return response.json()
         } )
        .then( (data) => {
            window.localStorage.setItem('user', JSON.stringify(data))
            window.dispatchEvent( new Event('authenticate') )
            navigate('/profile')
        })
        .catch( err => {
            switch (err.message){
                case '400':
                case '401':
                    setError(<h2>Username/Email or Password is Incorrect</h2>)
                    break
                default:
                    setError(<h2>Login Failed</h2>)
            }
        })
    }

    return (
        <div className="container-fluid py-5 text-center">

            <h1 className="display-5 fw-bold">Log in to Canopy</h1>

            <p className="fs-4 mb-5">
                Don't have an account? <Link to='/register' className='btn btn-primary'> Register </Link>
            </p>

            {error}

            <div className="row" style={{marginBottom:'5%'}}>
                <div className="col-md-6 offset-md-3 ">
                    <form className='bg-light'>
                        <div className='mb-3'>
                            <label htmlFor='username-input' className='form-label'>Username</label>
                            <input
                                type='text'
                                className='form-control'
                                id='username-input'
                                placeholder='username'
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='password-input' className='form-label'>Password</label>
                            <input
                                type='password'
                                className='form-control'
                                id='password-input'
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <button type='submit' className='btn btn-primary' onClick={handleSubmit}>Log In</button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;