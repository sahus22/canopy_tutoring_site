import React, { useState } from 'react'
import StarRatings from 'react-star-ratings'
import ReactCountryFlag from 'react-country-flag';
import { ChevronLeft } from 'react-bootstrap-icons';
import FavoriteTutorButton from '../widgets/FavoriteTutorButton';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AppointmentScheduler = (props) =>{
    const {user, tutor , showForm,setShowForm} = props 
    const [timeslot_start,setTimeSlotStart] = useState(new Date());
    const [timeslot_end,setTimeSlotEnd] = useState(new Date());
    const [description,setDescription] = useState("");
    const auth = JSON.parse(localStorage.getItem('user'));
    const [appError,setAppError] = useState(false);

    function confirmAppointment()
    {
        //Insert Appointment
        fetch(`/api/appointments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': auth.token
            },
            body: JSON.stringify({
                "student_id": user._id,
                "student_name": user.name,
                "tutor_id": tutor._id,
                "tutor_name": tutor.name ,
                "start_time": timeslot_start,
                "end_time": timeslot_end,
                "description": description
            })
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status)
            })
            .catch(err => {
                setAppError(err)
                console.log("Appoinment Error: "+ err)
            }) 
    }
    // if(appError)
    // {
    //     setShowForm(false)        
    // }    
    if(showForm)
    {
        if(appError)
        {
            setTimeout(() => setAppError(false), 3000)
            return(
                <div><label style={{color:'red'}}>Error in Scheduling an Appoinment,Please go back and try again</label></div>
            )
        }                
        else
        {                      
            return (
                <div> 
                    <form>
                        <div>
                        <label>Appointment Start Time :</label>
                        <DatePicker selected={timeslot_start} showTimeSelect onChange={(date) => setTimeSlotStart(date)} />
                        </div>
                        <div>
                        <label>Appointment End Time :</label>
                        <DatePicker selected={timeslot_end} showTimeSelect onChange={(date) => setTimeSlotEnd(date)} />
                        </div>
                        <div> <input id='app_description' style={{margin: '10px',marginLeft: '3px'}} value={description} onChange={(e)=>setDescription(e.target.value)} type="text" placeholder='Enter any Description'/> </div>
                    </form>
                    <button type="button" className="btn btn-light" style={{ maxWidth: '20em', margin: '0.3em' }} onClick={confirmAppointment}>Confirm Appointment</button>
                </div>
                    );
        }
    }    
    else
    return(<div />);
}


const TutorDetails = (props) => {
    const { tutor, updateRenderTutorDetails, user, setUser} = props;
    const [showForm,setShowForm] = useState(false);
    const fullName = tutor.name;
    const avgRating = tutor.tutor_details.average_rating;
    const location = tutor.tutor_details.location.city + ', ' + tutor.tutor_details.location.state + ', ' + tutor.tutor_details.location.country_code;
    const profileImage = tutor.profile_image;
    const Tags = tutor.tutor_details.tags.join(', ');
    const languages = tutor.tutor_details.languages.join(', ');
    const emailAddress = tutor.email_address;
    const description = tutor.tutor_details.description;

    const test = tutor.tutor_details.subjects.map((subject, index) => {
        return (
            <div className="row" key={index}>
                <div className="col-sm-3">
                    <h6 className="mb-0">{subject.subject}</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                    {subject.levels.join(', ')}
                </div>
                <hr />
            </div>)
    })

    function setTutorDetailsValues() {
        updateRenderTutorDetails(false)
    }

    function showAppntForm()
    {
        console.log(showForm)
        setShowForm(!showForm)
    }

    return (
        <div className="container">
            <button type="button" className="btn btn-light" style={{ maxWidth: '10em', margin: '0.3em' }} onClick={setTutorDetailsValues} ><ChevronLeft />Back</button>
            <button type="button" className="btn btn-light" style={{ maxWidth: '20em', margin: '0.3em' }} onClick={showAppntForm} >Schedule an Appointment</button>
            <div className="main-body">
            <AppointmentScheduler user = {user} tutor = {tutor} showForm={showForm} setShowForm={setShowForm}/>
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img className="img-fluid rounded-start" src={profileImage} width="200em" alt="profile image"/>
                                    <div className="mt-3">
                                        <h4>{fullName}</h4> <FavoriteTutorButton tutor={tutor} user={user} setUser={setUser}/>
                                        <p className="text-muted font-size-sm"><ReactCountryFlag countryCode={tutor.tutor_details.location.country_code} svg style={{ width: '1em', height: '1em' }} /> {location}</p>
                                        <p className="text-muted font-size-sm">{emailAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Rating</h6>
                                    <StarRatings rating={avgRating || 0} starRatedColor='gold' starDimension='1em' starSpacing='0.1em' />
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Languages</h6>
                                    <span className="text-secondary">{languages}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">Tags</h6>
                                    <span className="text-secondary">{Tags}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Full Name</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {fullName}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {emailAddress}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Address</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row gutters-sm">
                            <div className="col-sm-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h4 className="d-flex align-items-center mb-3 card-title">Description</h4>
                                        <p className="card-text">{description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h4 className="d-flex align-items-center mb-3 card-title">Subjects</h4>
                                        {test}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row gutters-sm">
                            <div className="col-sm-12 mb-3">
                                <div className="card h-100">
                                    <div className='card-body'>
                                        <h4 className="d-flex align-items-center mb-3 card-title">Your Review</h4>
                                        <ReviewForm user={user} tutor={tutor} />
                                        <hr />
                                        <ReviewList tutor={tutor} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorDetails;