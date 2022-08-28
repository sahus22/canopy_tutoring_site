import React from 'react'

const DeleteAppointmentButton = (props) => {

    const { appointment } = props

    const [authorized, setAuthorized] = React.useState(false)
    const [completed, setCompleted] = React.useState(false)

    React.useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('user'));
        // if the user is not logged in, they can't cancel the appointment
        if (!auth || !auth.user_id){
            setAuthorized(false);
            return;
        }

        // if the user is not the tutor or student, they can't cancel the appointment
        if (auth.user_id !== appointment.student_id && auth.user_id !== appointment.tutor_id){
            setAuthorized(false);
            return;
        }

        // if the appointment is before 24 hours in the future, it can't be cancelled
        if (new Date(appointment.start_time) <= (Date.now() + 24*60*60*1000)){
            setAuthorized(false);
            return;
        }

        // all checks passed
        setAuthorized(true);
    }, [appointment])

    const deleteAppointment = () => {
        const auth = JSON.parse(localStorage.getItem('user'));
        fetch(`/api/appointments/${appointment._id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': auth.token
            }
        })
        .then( response => {
            if (!response.ok) throw new Error(response.status)
         } )
        .then( () => {
            setCompleted(true)
        })
        .catch( err => {
            setCompleted(false)
            if (err.message === '401'){
                setAuthorized(false)
            }
        })
    }

    // make button invisible if the user is not authorized
    if (!authorized){
        return <></>
    }

    if (completed){
        return (
            <button className='btn btn-success disabled'>
                Appointment Cancelled!
            </button>
        )
    } else {
        return (
            <button className='btn btn-danger' onClick={deleteAppointment}>
                Cancel Appointment
            </button>
        )
    }

}

export default DeleteAppointmentButton