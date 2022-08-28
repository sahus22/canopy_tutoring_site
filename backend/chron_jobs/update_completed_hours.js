
const appointments_DAO = require('../DAO/appointments_DAO')
const users_DAO = require('../DAO/users_DAO')

async function update_completed_hours() {
    const users = await users_DAO.get_all()

    for (let user of users){
        user.completed_student_hours = await appointments_DAO.get_completed_student_hours(user._id)

        if (user.tutor_details){
            user.tutor_details.completed_tutor_hours = await appointments_DAO.get_completed_tutor_hours(user._id)
        }

        users_DAO.update(user._id, user)
    }
}

module.exports = update_completed_hours