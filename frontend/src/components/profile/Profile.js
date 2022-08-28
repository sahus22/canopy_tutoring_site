import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BoxArrowLeft, PencilSquare, XLg, Upload, PlusLg, Book } from 'react-bootstrap-icons';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import StarRatings from 'react-star-ratings/build/star-ratings';


const Profile = () => {
    const [user, setUser] = React.useState({})
    const [editable, setEditable] = React.useState(false)
    const [isTutor, setIsTutor] = React.useState(false)
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const auth = JSON.parse(localStorage.getItem('user'));
    const [country, setCountry] = React.useState('United States of America');
    const [state, setState] = React.useState('');
    const [city, setCity] = React.useState('');
    const [tags, setTags] = React.useState(['Tutor'])
    const [profileImage, setProfileImage] = React.useState('images/default.jpg');
    const [languages, setLanguages] = React.useState([]);
    const { getCode, getName, getNames } = require('country-list');
    const [subjectsObject, setSubjectsObject] = React.useState([{ subject: "Math", levels: [] }])
    const [completedStudentHours, setCompletedStudentHours] = React.useState(0)
    const [completedTutorHours, setCompletedTutorHours] = React.useState(0)
    const [image, setImage] = React.useState({ preview: '', data: '' })
    const navigate = useNavigate();
    let timeArray = [
        ["12:00 am", 0],
        ["1:00 am", 1],
        ["2:00 am", 2],
        ["3:00 am", 3],
        ["4:00 am", 4],
        ["5:00 am", 5],
        ["6:00 am", 6],
        ["7:00 am", 7],
        ["8:00 am", 8],
        ["9:00 am", 9],
        ["10:00 am", 10],
        ["11:00 am", 11],
        ["12:00 pm", 12],
        ["1:00 pm", 13],
        ["2:00 pm", 14],
        ["3:00 pm", 15],
        ["4:00 pm", 16],
        ["5:00 pm", 17],
        ["6:00 pm", 18],
        ["7:00 pm", 19],
        ["8:00 pm", 20],
        ["9:00 pm", 21],
        ["10:00 pm", 22],
        ["11:00 pm", 23],
    ]

    React.useEffect(() => {
        const fetchUser = async () => {
            // fetch user model
            const auth = JSON.parse(localStorage.getItem('user'));
            if (!auth || !auth.user_id) {
                return navigate('/login')
            }

            const user_model = await fetch(`/api/users/${auth.user_id}`, {
                // const user_model = await fetch(`/api/users/6251dda6902f086780d70965`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': auth.token
                }
            });
            const user_json = await user_model.json();
            // update component state with user model
            setUser(user_json);
            setDefaultValues(user_json);
        }

        fetchUser().catch(console.error);
    }, []);



    function handleSubjectChange(value, idx) {
        const newSubjectsObject = subjectsObject.map((subjectObject, sidx) => {
            if (idx !== sidx) return subjectObject;
            return { ...subjectObject, subject: value };
        });
        setSubjectsObject(newSubjectsObject)
    }
    function handleSubjectLevelChange(evt, idx) {
        let selectedSubjectLevels = Array.from(evt.target.selectedOptions, option => option.value);
        const newSubjectsObject = subjectsObject.map((subjectObject, sidx) => {
            if (idx !== sidx) return subjectObject;
            return { ...subjectObject, levels: selectedSubjectLevels };
        });
        setSubjectsObject(newSubjectsObject)
    }
    function handleAddSubjects() {
        setSubjectsObject(subjectsObject.concat([{ subject: "Math", levels: [] }]))
    }
    function handleRemoveSubjects(idx) {
        if (subjectsObject.length > 1)
            setSubjectsObject(subjectsObject.filter((s, sidx) => idx !== sidx))
    }

    function setDefaultValues(user_json) {
        setFullName(user_json.name)
        setEmail(user_json.email_address)
        setProfileImage(user_json.profile_image)
        setCompletedStudentHours(user_json.completed_student_hours)
        setImage({ preview: '', data: '' })
        if (user_json.tutor_details) {
            setIsTutor(true)
            setDescription(user_json.tutor_details.description)
            setTags(user_json.tutor_details.tags)
            setStartTime(new Date(user_json.tutor_details.work_start_time))
            setEndTime(new Date(user_json.tutor_details.work_end_time))
            setCity(user_json.tutor_details.location.city)
            setState(user_json.tutor_details.location.state)
            setCountry(getName(user_json.tutor_details.location.country_code))
            setLanguages(user_json.tutor_details.languages)
            setSubjectsObject(user_json.tutor_details.subjects)
            setCompletedTutorHours(user_json.tutor_details.completed_tutor_hours)
        }
        else {
            setIsTutor(false)
            setDescription('');
            setSubjectsObject([{ subject: "Math", levels: [] }])
            setCountry('United States of America');
            setState('');
            setCity('');
            setTags(['Tutor'])
            setLanguages([]);
            setStartTime(new Date());
            setEndTime(new Date());
        }
    }

    function signOutUser() {
        window.localStorage.removeItem('user')
        window.dispatchEvent(new Event('authenticate'))
        navigate('/')
    }

    function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData()
        if (image.data !== '')
            formData.append('file', image.data)
        let tutorDetails = null
        if (isTutor) {
            tutorDetails = {
                "tags": tags,
                "description": description,
                "languages": languages,
                "location": {
                    "city": city,
                    "state": state,
                    "country_code": getCode(country)
                },
                "subjects": subjectsObject,
                "work_start_time": startTime,
                "work_end_time": endTime
            }
        }
        formData.append('json',
            JSON.stringify({
                "name": fullName,
                "email_address": email,
                "profile_image": profileImage,
                "tutor_details": tutorDetails
            }))
        fetch(`/api/users/${user._id}`, {
            method: 'PUT',
            headers: {
                'x-access-token': auth.token
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error(response.status)
            })
            .catch(err => {
                console.log(err)
            })
        setEditable(false)
    }

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    let editButton, submitButton, profileImageInput, fullNameElement, emailElement, subjectElement, addSubjectButton, tagsElement, descriptionElement, languagesElement, addressElement, startTimeElement, endTimeElement, completedStudentHoursElement, completedTutorHoursElement, averageRatingElement
    if (editable) {
        editButton = <button type="button" className="btn btn-secondary ms-auto" style={{ width: '6em', marginRight: '1em', marginBottom: '0.5em' }} onClick={(e) => { setEditable(false); setDefaultValues(user) }}><XLg /> Cancel </button>
        submitButton = <button type="submit" className="btn btn-primary mx-auto" style={{ width: '10em', marginBottom: '1em' }}><Upload /> Submit</button>
        profileImageInput = <input type='file' className='form-control' name='file'
            style={{ margin: '1em' }}
            onChange={(e) => { setImage({ preview: URL.createObjectURL(e.target.files[0]), data: e.target.files[0], }) }}
        />
        fullNameElement = <input className="form-control" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        emailElement = <input className="form-control" type="email" value={email} readOnly onChange={(e) => setEmail(e.target.value)} />
        subjectElement = (subjectsObject.map((subjectObject, idx) => (
            <div className="row" key={idx}>
                <div className="col-sm-5">
                    <label>Select Subject</label>
                    <select className="form-control" value={subjectObject.subject} onChange={(e) => handleSubjectChange(e.target.value, idx)}>
                        <option>Math</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                    </select>
                </div>
                <div className="col-sm-6">
                    <label>Select level(s)</label>
                    <select multiple className="form-control" value={subjectObject.levels} onChange={(e) => handleSubjectLevelChange(e, idx)}>
                        <option>Elementary</option>
                        <option>Middle School</option>
                        <option>High School</option>
                    </select>
                </div>
                <div className="col-sm-1 my-auto">
                    <button type="button" className="btn btn-secondary" onClick={(e) => handleRemoveSubjects(idx)}>-</button>
                </div>
            </div>
        )))
        addSubjectButton = <button type="button" className="btn btn-secondary mx-auto" style={{ width: '10em', margin: '0.5em' }} onClick={handleAddSubjects}><PlusLg /> Add Subject</button>
        tagsElement = <ReactTagInput
            tags={tags}
            placeholder="Type a tag and press enter"
            editable={true}
            readOnly={false}
            removeOnBackspace={true}
            onChange={(newTags) => setTags(newTags)}
        />
        descriptionElement = <textarea className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} />
        languagesElement = (
            <React.Fragment>
                <label>Select Language(s)</label>
                <select multiple className="form-control" value={languages} onChange={(e) => setLanguages(Array.from(e.target.selectedOptions, option => option.value))} >
                    <option>English</option>
                    <option>Mandarin </option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Arabic</option>
                    <option>Russian</option>
                    <option>Portuguese</option>
                    <option>Indonesian</option>
                </select>
            </React.Fragment>)
        addressElement = (
            <div className="row">
                <div className="col-sm-4">
                    <label>Select Country</label>
                    <select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)}>
                        {getNames().map((country, i) => <option key={i}>{country}</option>)}
                    </select>
                </div>
                <div className="col-sm-4">
                    <label>Input State</label>
                    <input className="form-control" type="text" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="col-sm-4">
                    <label>Input City</label>
                    <input className="form-control" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
            </div>)
        startTimeElement = <select className="form-control" value={startTime.getHours()}
            onChange={(e) => {
                let startTimeTemp = new Date()
                startTimeTemp.setHours(e.target.value, 0, 0, 0)
                setStartTime(startTimeTemp)
            }} >
            {timeArray.map((time, i) => <option key={i} value={time[1]}>{time[0]}</option>)}
        </select>
        endTimeElement = <select className="form-control" value={endTime.getHours()}
            onChange={(e) => {
                let emdTimeTemp = new Date()
                emdTimeTemp.setHours(e.target.value, 0, 0, 0)
                setEndTime(emdTimeTemp)
            }} >
            {timeArray.map((time, i) => <option key={i} value={time[1]}>{time[0]}</option>)}
        </select>
    }
    else {
        editButton = <button type="button" className="btn btn-secondary ms-auto" style={{ width: '6em', marginRight: '1em', marginBottom: '0.5em' }} onClick={(e) => { setEditable(true) }}><PencilSquare /> Edit </button>
        fullNameElement = fullName
        emailElement = email
        subjectElement = subjectsObject.map((subjectObject, index) => (
            <div className="row" key={index}>
                <div className="col-sm-3">
                    <h6 className="mb-0">{subjectObject.subject}</h6>
                </div>
                <div className="col-sm-9">
                    {subjectObject.levels.join(', ')}
                </div>
                <hr />
            </div>
        ))
        tagsElement = tags.join(', ')
        descriptionElement = <p className="card-text">{description}</p>
        languagesElement = languages.join(', ')
        addressElement = city + ', ' + state + ', ' + country
        startTimeElement = <p className="card-text">{formatAMPM(startTime)}</p>
        endTimeElement = <p className="card-text">{formatAMPM(endTime)}</p>
        completedStudentHoursElement = (
            <div className="card mt-3">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="mb-0">Completed student hours</h6>
                        <span className="text-secondary">{completedStudentHours}</span>
                    </li>
                </ul>
            </div>)
        if(isTutor){
            completedTutorHoursElement = (
                <div className="card mt-3">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">Completed tutor hours</h6>
                            <span className="text-secondary">{completedTutorHours}</span>
                        </li>
                    </ul>
                </div>)
            
            averageRatingElement = (
                <div className="card mt-3">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">Average Rating</h6>
                            <StarRatings rating={user.tutor_details.average_rating || 0} starRatedColor='gold' starDimension='1em' starSpacing='0.1em'/>
                        </li>
                    </ul>
                </div>)
        }
    }

    let tutorButton
    if (!isTutor && editable)
        tutorButton = <button type="button" className="btn btn-warning" style={{ width: '8em', marginBottom: '0.5em' }} onClick={(e) => setIsTutor(true)}><Book /> Make Tutor</button>

    return (
        <form onSubmit={handleSubmit}>
            <div className="container" style={{ marginTop: '1em' }}>
                <div className="main-body">
                    <div className="row">
                        <div className="col-sm-4"> <div className="row">
                            <button type="button" className="btn btn-danger mx-auto" style={{ width: '10em', marginBottom: '0.5em' }} onClick={signOutUser}><BoxArrowLeft /> Sign Out </button>
                        </div></div>
                        <div className="col-sm-4">{tutorButton}</div>
                        <div className="col-sm-4">
                            <div className="row">{editButton}</div>
                        </div>
                    </div>
                    <div className="row gutters-sm">
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img className="img-fluid rounded-start" src={image.preview === '' ? profileImage : image.preview} width="200em" alt='Profile Image' />
                                        {profileImageInput}
                                    </div>
                                </div>
                            </div>
                            {completedStudentHoursElement}
                            {completedTutorHoursElement || <></>}
                            {averageRatingElement || <></>}
                        </div>
                        <div className="col-md-8">
                            <div>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Full Name</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {fullNameElement}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Email</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {emailElement}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3" style={isTutor ? {} : { display: 'none' }}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Subjects</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                <div className="row">
                                                    {subjectElement}
                                                </div>
                                                <div className="row">
                                                    {addSubjectButton}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Tags</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {tagsElement}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Description</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {descriptionElement}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Languages Known</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {languagesElement}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Address</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                {addressElement}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0 fw-bold">Working Hours</h6>
                                            </div>
                                            <div className="col-sm-9">
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <label className='text-secondary'>Start time</label>
                                                        {startTimeElement}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <label className='text-secondary'>End Time</label>
                                                        {endTimeElement}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {submitButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
}

export default Profile;