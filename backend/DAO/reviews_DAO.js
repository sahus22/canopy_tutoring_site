var monk = require('monk');
var db = monk('localhost/canopy');

var collection = db.get('reviews');

/* BEGIN OBJECT NORMALIZATION UTILITY FUNCTIONS */

// copies over the correct properties of the source object to create a well-formed review object
function normalize_review(source) {
    if (!source) {
        source = {}
    }

    return {
        student_id: source.student_id,
        student_name: source.student_name,
        tutor_id: source.tutor_id,
        tutor_name: source.tutor_name,
        rating: source.rating,
        comment: source.comment,
    }
}

/* BEGIN REST CRUD FUNCTIONS */

// create
async function create(review) {
    let normalized = normalize_review(review);
    let results = await collection.insert(normalized);
    return results;
}

// read
async function get(review_id) {
    return await collection.findOne({ _id: review_id });
}

async function get_by_tutor_id(tutor_id) {
    return await collection.find({ tutor_id: tutor_id })
}

async function get_by_student_id(student_id) {
    return await collection.find({ student_id: student_id })
}

async function get_by_tutor_and_student(tutor_id, student_id) {
    return await collection.findOne({ tutor_id: tutor_id, student_id: student_id })
}

async function get_tutor_average_rating(tutor_id) {
    let results = await collection.aggregate([
        { $match: { tutor_id: tutor_id } },
        { $group: { _id: null, average_rating: { $avg: "$rating" } } },
    ])

    return (results[0] || {}).average_rating || 0
}

// read_all
async function get_all() {
    return await collection.find({});
};

// update
async function update(id, review) {
    let normalized = normalize_review(review);
    return await collection.update({ _id: id }, { $set: normalized });
}

async function insert_or_update(review) {
    let normalized = normalize_review(review)
    return await collection.update(
        { student_id: normalized.student_id, tutor_id: normalized.tutor_id }, 
        { $set: normalized }, 
        { upsert: true }
    )
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
    get_by_tutor_and_student,
    get_tutor_average_rating,
    get_all,
    update,
    insert_or_update,
    remove
}