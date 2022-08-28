import React from 'react'

// import './TutorInfoCard.css'

const AppointmentInfoCard = (props) => {
    const { appointment, setSelectedAppointment } = props;

    const studentName = appointment.student_name;
    const tutorName = appointment.tutor_name;
    const startTime = appointment.start_time;
    const endTime = appointment.end_time;
    const description = appointment.description;

    return (
        <div className="card mb-3" style={{ width: '40em', margin: '0.5em' }} onClick={() => setSelectedAppointment(appointment)}>
        <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">Description</h6>
                <span className="text-secondary">{description}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">Student Name</h6>
                <span className="text-secondary">{studentName}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">Tutor Name</h6>
                <span className="text-secondary">{tutorName}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">Start Time</h6>
                <span className="text-secondary">{startTime}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0">End Time</h6>
                <span className="text-secondary">{endTime}</span>
            </li>
        </ul>
    </div>
    );
};

export default AppointmentInfoCard;