var monk = require('monk');
var db = monk('localhost/canopy');

var collection = db.get('user_auth');

/* BEGIN OBJECT NORMALIZATION UTILITY FUNCTIONS */

// copies over the correct properties of the source object to create a well-formed user auth object
function normalize_user_auth(source){
    if (!source){
        source = {}
    }
  
    return {
        username: source.username,
        email: source.email,
        password_hash: source.password_hash,
    }
  }

/* BEGIN REST CRUD FUNCTIONS */

// create
async function create(user_auth){
    let normalized = normalize_user_auth(user_auth);
    let results = await collection.insert(normalized);
    return results;
}

// read
async function get(user_auth_id){
    return await collection.findOne({_id: user_auth_id});
}

// get by username
async function get_by_username(username){
    return await collection.findOne({username: username})
}

// get by email
async function get_by_email(email){
    return await collection.findOne({email: email})
}

// read_all
async function get_all(){
    return await collection.find({});
};

// update
async function update(id, user_auth){
    let normalized = normalize_user_auth(user_auth);
    return await collection.update({_id: id}, {$set: normalized});
}

// delete
async function remove(id){
    return await collection.remove({_id: id});
}

module.exports = {
    create,
    get,
    get_by_username,
    get_by_email,
    get_all,
    update,
    remove
}