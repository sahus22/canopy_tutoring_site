import { React, useMemo } from 'react'
import { momentLocalizer } from 'react-big-calendar';

import { Calendar, Views } from 'react-big-calendar'
import moment from 'moment';

import 'react-big-calendar/lib/sass/styles.scss';
import DeleteAppointmentButton from '../widgets/DeleteAppointmentButton';

const localizer = momentLocalizer(moment);

const AppointmentDetails = (props) => {

    const { appointment } = props;

    const events = useMemo(() => [{
        id: 0,
        title: appointment.description,
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time)
    }], [appointment])

    const defaultDate = useMemo(() => events[0].start, [events])
    return (
      <div className="container">
          <div className="col-md-8">
            <div className="card mb-3 mt-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-3">
                            <h6 className="mb-0">Description</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                            {appointment.description}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-3">
                            <h6 className="mb-0">Tutor</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                            {appointment.tutor_name}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-3">
                            <h6 className="mb-0">Student</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                            {appointment.student_name}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-3">
                            <h6 className="mb-0">Start/End times</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                            {appointment.start_time} / {appointment.end_time}
                        </div>
                    </div>
                    <DeleteAppointmentButton appointment={appointment} />
                </div>
            </div>
        </div>
        <div className="height600 bg-light">
          <Calendar
            defaultDate={defaultDate}
            defaultView={Views.DAY}
            events={events}
            localizer={localizer}
            step={30}
          />
        </div>
      </div>
    )

}

export default AppointmentDetails;