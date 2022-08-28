import React from 'react';

import { useNavigate, Link } from 'react-router-dom';

const Register = (props) => {

    // form state variables
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // workflow state variables
    const [usernameValidationError, setUsernameValidationError] = React.useState('')
    const [emailValidationError, setEmailValidationError] = React.useState('')
    const [passwordValidationError, setPasswordValidationError] = React.useState(<></>)

    const [error, setError] = React.useState(<></>)

    const navigate = useNavigate();

    function validate_username(){

        if (!username){
            setUsernameValidationError('must enter a username')
            return false
        }

        setUsernameValidationError('')
        return true
    }
    function validate_email(){
        const email_validation_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const valid_email = email_validation_regex.test(email)

        if (!valid_email){
            setEmailValidationError('must be a valid email address')
            return false
        }

        setEmailValidationError('');

        return true
    }
    function validate_password(){
        const contains_uppercase = /[A-Z]/.test(password)
        const contains_lowercase = /[a-z]/.test(password)
        const contains_number = /[0-9]/.test(password)
        const contains_special_character = /[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]/.test(password)
        const is_eight_characters_or_more = password.length >= 8

        let help_messages = []

        if(!contains_uppercase)
            help_messages.push('must contain an uppercase letter')
        if (!contains_lowercase)
            help_messages.push('must contain a lowercase letter')
        if(!contains_number)
            help_messages.push('must contain a number')
        if(!contains_special_character)
            help_messages.push('must contain a special character (!@#$%^&*()_+\\-=[]{};:\'"\\|,.<>/?)')
        if(!is_eight_characters_or_more)
            help_messages.push('must be at least 8 characters long')

        if(help_messages.length > 0){
            const help_message_list_view = (
                <ul>
                    {help_messages.map((message, index) => <li key={index}>{message}</li>)}
                </ul>
            )
            setPasswordValidationError(help_message_list_view)
            return false
        }

        setPasswordValidationError(<></>)
        return true
    }

    function handleSubmit(event){
        event.preventDefault();
        // split validation evaluation to prevent boolean shortcuts
        let validation_success = validate_username()
        validation_success = validate_email() && validation_success
        validation_success = validate_password() && validation_success

        if (validation_success){
            //actually make the account
            // handle api error
            // on success, grant auth token and redirect to profile page
            fetch('/api/user_auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify( {
                    "username": username,
                    "email": email,
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
                        setError(<h2>A user with that username or email already exists</h2>)
                        break
                    case '401':
                        setError(<h2>All fields must be present</h2>)
                        break
                    default:
                        setError(<h2>Registration Failed</h2>)
                }
            })
        }
    }

    return (
        <div className="container-fluid py-5 text-center">

            <h1 className="display-5 fw-bold">Create a Canopy Account</h1>

            <p className="fs-4 mb-5">
                Already have an account? <Link to='/login' className='btn btn-primary'> Log In </Link>
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
                                aria-describedby='username-help'
                                onFocus={validate_username}
                                onChange={(event) => setUsername(event.target.value)}
                                onBlur={validate_username}
                                onKeyUp={validate_username}
                            />
                            <div id='username-help' className='form-text text-danger'>
                                {usernameValidationError}
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='email-input' className='form-label'>Email Address</label>
                            <input
                                type='email'
                                className='form-control'
                                id='email-input'
                                placeholder='user@example.com'
                                aria-describedby='email-help'
                                onFocus={validate_email}
                                onChange={(event) => setEmail(event.target.value)}
                                onBlur={validate_email}
                                onKeyUp={validate_email}
                            />
                            <div id='email-help' className='form-text text-danger'>
                                {emailValidationError}
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='password-input' className='form-label'>Password</label>
                            <input
                                type='password'
                                className='form-control'
                                id='password-input'
                                aria-describedby='password-help'
                                onFocus={validate_password}
                                onChange={(event) => setPassword(event.target.value)}
                                onBlur={validate_password}
                                onKeyUp={validate_password}
                            />
                            <div id='password-help' className='form-text text-danger'>
                                {passwordValidationError}
                            </div>
                        </div>

                        <button type='submit' className='btn btn-primary' onClick={handleSubmit}>Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;