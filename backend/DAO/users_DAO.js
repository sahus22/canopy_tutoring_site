var monk = require('monk');
var db = monk('localhost/canopy');

var collection = db.get('users');

/* BEGIN OBJECT NORMALIZATION UTILITY FUNCTIONS */

function normalize_subject_list(source_subjects){
    let subjects = []
    for (let source_subject of source_subjects){
        subjects.push(
            {
                subject: source_subject.subject,
                levels: [...source_subject.levels].filter(level => typeof level === 'string')
            }
        )
    }

    return subjects;
}

function normalize_location(source_location){
    if (!source_location){
        source_location = {}
    }

    let location = {
        city: source_location.city,
        state: source_location.state,
        country_code: source_location.country_code
    };

    return location;
}

function normalize_tutor_details(source_tutor_details){

    if (!source_tutor_details){
        return null
    }

    let subjects;
    if (source_tutor_details.subjects){
        subjects = normalize_subject_list(source_tutor_details.subjects);
    }

    let location;
    if (source_tutor_details.location){
        location = normalize_location(source_tutor_details.location);
    }


    let tutor_details = {
        tags: source_tutor_details.tags,
        description: source_tutor_details.description || "",
        languages: source_tutor_details.languages || [],
        average_rating: source_tutor_details.average_rating || 0,
        completed_tutor_hours: source_tutor_details.completed_tutor_hours || 0,
        work_start_time: source_tutor_details.work_start_time,
        work_end_time: source_tutor_details.work_end_time,
        location: location,
        subjects: subjects
    };

    return tutor_details;
}

// copies over the correct properties of the source object to create a well-formed user object
function normalize_user(source){

    if (!source){
        source = {}
    }

    let tutor_details;
    if (source.tutor_details){
        tutor_details = normalize_tutor_details(source.tutor_details);
    }

    let user = {
        name: source.name,
        email_address: source.email_address,
        profile_image: source.profile_image,
        favorite_tutors: source.favorite_tutors,
        completed_student_hours: source.completed_student_hours || 0,
        tutor_details: tutor_details
    };

    return user;
}

/* BEGIN REST CRUD FUNCTIONS */

// create
// optionally, provide an id to force a particular id to be used
async function create(user, id){
    let normalized = normalize_user(user);
    if (id){
        normalized._id = id
    }
    let results = await collection.insert(normalized);
    return results;
}

// read
async function get(user_id){
    return await collection.findOne({_id: user_id});
}

// read all tutors
async function get_tutors(){
    // return all users where tutor_details is not null
    return await collection.find({"tutor_details":{$ne:null}})
}

// read_all
async function get_all(){
    return await collection.find({});
};

// update
async function update(id, user){
    let normalized = normalize_user(user);
    return await collection.update({_id: id}, {$set: normalized});
}

// delete
async function remove(id){
    return await collection.remove({_id: id});
}

module.exports = {
    create,
    get,
    get_tutors,
    get_all,
    update,
    remove
}