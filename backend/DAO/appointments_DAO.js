var monk = require('monk');
var db = monk('localhost/canopy');

var collection = db.get('appointments');

/* BEGIN OBJECT NORMALIZATION UTILITY FUNCTIONS */

// copies over the correct properties of the source object to create a well-formed appointment object
function normalize_appointment(source) {
    if (!source) {
        source = {}
    }

    return {
        student_id: source.student_id,
        student_name: source.student_name,
        tutor_id: source.tutor_id,
        tutor_name: source.tutor_name,
        start_time: new Date(source.start_time),
        end_time: new Date(source.end_time),
        description: source.description
    }
}

/* BEGIN REST CRUD FUNCTIONS */

// create
async function create(appointment) {
    let normalized = normalize_appointment(appointment);
    let results = await collection.insert(normalized);
    return results;
}

// read
async function get(appointment_id) {
    return await collection.findOne({ _id: appointment_id });
}

async function get_by_tutor_id(tutor_id) {
    return await collection.find({ tutor_id: tutor_id })
}

async function get_by_student_id(student_id) {
    return await collection.find({ student_id: student_id })
}

async function get_conflicts(appointment) {
    // for a given appointment, find items for the same tutor or student that have time conflicts
    let normalized = normalize_appointment(appointment)

    console.log(normalized)

    return await collection.find({
        $or: [
            { tutor_id: normalized.tutor_id },
            { student_id: normalized.student_id }
        ],
        start_time: {$lte: normalized.end_time}, 
        end_time: {$gte: normalized.start_time}
    })
}

async function get_completed_tutor_hours(tutor_id) {

    const results = await collection.aggregate([
        { $match: { start_time: { $lte: new Date() }, tutor_id: String(tutor_id) } },
        {
            $group: {
                _id: null, total_tutor_hours: {
                    $sum: {
                        $dateDiff: {
                            startDate: "$start_time",
                            endDate: "$end_time",
                            unit: "hour"
                        }
                    }
                }
            }
        },
    ])

    return (results[0] || {}).total_tutor_hours || 0
}

async function get_completed_student_hours(student_id) {

    const results = await collection.aggregate([
        { $match: { start_time: { $lte: new Date() }, student_id: String(student_id) } },
        {
            $group: {
                _id: null, total_student_hours: {
                    $sum: {
                        $dateDiff: {
                            startDate: "$start_time",
                            endDate: "$end_time",
                            unit: "hour"
                        }
                    }
                }
            }
        },
    ])

    return (results[0] || {}).total_student_hours || 0
}

async function get_by_date_range(start_date, end_date) {
    return await collection.find({start_time: {$gt: start_date, $lte: end_date}})
}

// read_all
async function get_all() {
    return await collection.find({});
};

// update
async function update(id, appointment) {
    let normalized = normalize_appointment(appointment);
    return await collection.update({ _id: id }, { $set: normalized });
}

// delete
async function remove(id) {
    return await collection.remove({ _id: id });
}

module.exports = {
    create,
    get,
    get_by_tutor_id,
    get_by_student_id,
    get_by_date_range,
    get_conflicts,
    get_completed_tutor_hours,
    get_completed_student_hours,
    get_all,
    update,
    remove
}