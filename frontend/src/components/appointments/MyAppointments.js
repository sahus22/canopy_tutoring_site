import React from 'react'
import { useNavigate } from 'react-router-dom';
import AppointmentInfoCard from '../widgets/AppointmentInfoCard';
import AppointmentDetails from './AppointmentDetails';

const MyAppointments = (props) => {

    const [studentAppointments, setStudentAppointments] = React.useState([])
    const [tutorAppointments, setTutorAppointments] = React.useState([]);

    const [selectedAppointment, setSelectedAppointment] = React.useState(null);

    const navigate = useNavigate();

    React.useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('user'));
        if (!auth || !auth.user_id){
            // if the user is not logged in; send them to the login screen
            return navigate('/login')
        }

        const fetchAppointmentsJson = async (setAppointments, extension) => {
            // fetch all appointments where the user is a student
            const appointmentsJson = await fetch(`/api/appointments/${extension}/${auth.user_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': auth.token
                }
            });
            const appointmentsList = await appointmentsJson.json();
            // update component state with new appointments list
            setAppointments(appointmentsList);
        }
        // fetch appointments where I am a student and where I am a tutor
        fetchAppointmentsJson(setStudentAppointments, 'student').catch(console.error);
        fetchAppointmentsJson(setTutorAppointments, 'tutor').catch(console.error);
    }, []);

    if (!(studentAppointments && studentAppointments.length) && !(tutorAppointments && tutorAppointments.length)){
        return <h1 style={{margin: '1em'}}>No Appointments</h1>
    }

    const studentAppointmentCards = studentAppointments.map((appointment, index) => {
        return (
            <AppointmentInfoCard
                key={index}
                appointment={appointment}
                setSelectedAppointment={setSelectedAppointment}
            />
        )
    });
    let studentAppointementsElement = <></>
    if (studentAppointments && studentAppointments.length){
        studentAppointementsElement = (
            <>
                <h1 style={{ margin: '0.5em' }}>Student Appointments</h1>
                <div className='cards'>
                    {studentAppointmentCards}
                </div>
            </>
        )
    }

    const tutorAppointmentCards = tutorAppointments.map((appointment, index) => {
        return (
            <AppointmentInfoCard
                key={index}
                appointment={appointment}
                setSelectedAppointment={setSelectedAppointment}
            />
        )
    });
    let tutorAppointementsElement = <></>
    if (tutorAppointments && tutorAppointments.length){
        tutorAppointementsElement = (
            <>
                <h1 style={{ margin: '0.5em' }}>Tutor Appointments</h1>
                <div className='cards'>
                    {tutorAppointmentCards}
                </div>
            </>
        )
    }

    if(selectedAppointment){
        return <AppointmentDetails appointment={selectedAppointment} />
    }

    return (
        <>
            {studentAppointementsElement}
            {tutorAppointementsElement}
        </>
    )
}

export default MyAppointments;