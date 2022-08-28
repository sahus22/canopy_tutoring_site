const nodemailer = require('nodemailer')

const appointments_DAO = require('../DAO/appointments_DAO')
const user_auth_DAO = require('../DAO/user_auth_DAO')

// gmail burner
// username: "canopy.cs6314@gmail.com"
// password: "Canopy: We've got you covered"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "canopy.cs6314@gmail.com",
        pass: "Canopy: We've got you covered"
    }
})

// every day, send appointment reminders for appointments that are tomorrow
// operation is expensive, so do it at 3am
async function send_appointment_reminders() {
    const begin_range = new Date()
    const end_range = new Date()
    end_range.setDate(end_range.getDate() + 1)

    const upcoming_appointments = await appointments_DAO.get_by_date_range(begin_range, end_range)

    for (const appointment of upcoming_appointments){
        const student = await user_auth_DAO.get(appointment.student_id)
        const tutor = await user_auth_DAO.get(appointment.tutor_id)

        const mailOptions = {
            from: 'canopy.cs6314@gmail.com',
            to: `${student.email}, ${tutor.email}`,
            subject: 'Upcoming Canopy Tutoring Appointment',
            text: `${appointment.tutor_name} will tutor ${appointment.student_name} at ${appointment.start_time}.
Appointment Description: ${appointment.description}
            
Good luck!
- The Canopy Team`
        }

        console.log(mailOptions)

        transporter.sendMail(mailOptions, (err) => {
            if(err) console.log(err)
        })
    }
}

module.exports = send_appointment_reminders