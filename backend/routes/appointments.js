var express = require('express');
var router = express.Router();

const authorize = require('./middleware/authorize')
const {get_user_data_from_request} = require('./utils/token')

const { sync_date } = require('./utils/datetime')

const appointments_DAO = require('../DAO/appointments_DAO')
const users_DAO = require('../DAO/users_DAO')


/* BEGIN VERIFICATION FUNCTIONS */

async function validate_appointment(appointment){

    const apt_start = new Date(appointment.start_time)
    const apt_end = new Date(appointment.end_time)

    // check that appointment time range is legal
    if (apt_start > apt_end && apt_start > new Date()){
        console.log("Appointment start and end time")
        return false
    }

    // check that the appointment doesn't conflict with other appointments
    const conflicts = await appointments_DAO.get_conflicts(appointment)
    console.log("Conflicts: ",conflicts)
    if (conflicts.length){
        console.log("Appointment Conflict")
        return false
    }

    // check that the tutor exists
    const tutor = await users_DAO.get(appointment.tutor_id)
    if (!tutor){
        console.log("New tutor")
        return false
    }

    // check that the appointment is within the tutor's working hours
    const work_start = new Date(tutor.tutor_details.work_start_time)
    const work_end = new Date(tutor.tutor_details.work_end_time)
    // make sure that the dates the same so we can accurately compare times
    // both are synced to apt_start because we don't want an appointment to cross a day boundary
    sync_date(apt_start, work_start)
    sync_date(apt_start, work_end)
    if(apt_start < work_start || apt_end > work_end){
        console.log("Compare times")
        return false
    }

    // all checks passed
    return true
}

/* BEGIN REST CRUD FUNCTIONS */

// create
router.post('/', authorize, async (req, res) => {

    const appointment = req.body

    // users are only allowed to create appointments where they are the student
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != appointment.student_id){
        return res.sendStatus(401)
    }

    // if the appointment isn't valid, then it is not well formed
    const valid = await validate_appointment(appointment)
    if (!valid){
        return res.sendStatus(400)
    }

    let results = await appointments_DAO.create(appointment)
    res.json(results);
})

// read_all
router.get('/', authorize, async (req, res) => {
    // there should be no instance where someone needs to get all the appointments
    return res.sendStatus(401)
    // regular implementation left commented out
    //let results = await appointments_DAO.get_all();
    //res.json(results);
});

// read all for given student
router.get('/student/:id', authorize, async (req, res) => {
    // users are only allowed to read their own student appointment list
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.params.id){
        return res.sendStatus(401)
    }

    let results = await appointments_DAO.get_by_student_id(req.params.id)
    res.json(results)
})

// read all for given tutor
router.get('/tutor/:id', authorize, async (req, res) => {
    
    let results = await appointments_DAO.get_by_tutor_id(req.params.id)

    // if the user is not the tutor, anonymize the appointments
    // users need the scheduling information to avoid conflicts
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.params.id){
        results = results.map(appointment => {
            return {
                tutor_id: appointment.tutor_id,
                tutor_name: appointment.tutor_name,
                start_time: appointment.start_time,
                end_time: appointment.end_time
            }
        })
    }

    res.json(results)
})

// read
router.get('/:id', authorize, async (req, res) => {
    // users are only allowed to read specific appointments where they are the student or tutor
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.body.student_id && user_data.user_id != req.body.tutor_id){
        return res.sendStatus(401)
    }

    let result = await appointments_DAO.get(req.params.id);
    res.json(result);
});

// update
router.put('/:id', authorize, async (req, res) => {
    // users are only allowed to update appointments where they are the student or tutor
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.body.student_id && user_data.user_id != req.body.tutor_id){
        return res.sendStatus(401)
    }

    let results = await appointments_DAO.update(req.params.id, req.body)
    res.json(results);
});

// delete
router.delete('/:id', authorize, async (req, res) => {
    // users are only allowed to delete appointments where they are the student or tutor
    const user_data = get_user_data_from_request(req)
    const appointment = await appointments_DAO.get(req.params.id)

    if (!appointment){
        // appointment is already deleted
        return res.sendStatus(200)
    }

    if (user_data.user_id != appointment.student_id && user_data.user_id != appointment.tutor_id){
        return res.sendStatus(401)
    }

    // users are only allowed to delete appointments >= 24 hours beforehand
    // time_to_appointment is in milliseconds
    const time_to_appointment = new Date(appointment.start_time) - Date.now()
    if (time_to_appointment < 24*60*60*1000){
        return res.sendStatus(400)
    }

    // delete the appointment
    let results = await appointments_DAO.remove(req.params.id);
    res.json(results);
});

module.exports = router;
