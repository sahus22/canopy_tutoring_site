var express = require('express');
var router = express.Router();

const authorize = require('./middleware/authorize')
const { get_user_data_from_request } = require('./utils/token')

const users_DAO = require('../DAO/users_DAO')
const reviews_DAO = require('../DAO/reviews_DAO')

const path = require("path");

/* BEGIN REST CRUD FUNCTIONS */

// create
router.post('/', authorize, async (req, res) => {
    // user creation should only happen through the registration workflow
    return res.sendStatus(404)
    // original implementation commented out
    //let results = await users_DAO.create(req.body)
    //res.json(results);
})

// read_all
router.get('/', authorize, async (req, res) => {
    // no one should ever need to read every user
    return res.sendStatus(404)
    // original implementation commented out
    // let results = await users_DAO.get_all();
    // res.json(results);
});

// read_all_tutors
router.get('/tutors', async (req, res) => {
    let results = await users_DAO.get_tutors();
    res.json(results);
})

// read
router.get('/:id', async (req, res) => {
    let result = await users_DAO.get(req.params.id);
    res.json(result);
});

// update
router.put('/:id', authorize, async (req, res) => {
    if (req.body.json || req.body) {
        const user_json = req.body.json ? JSON.parse(req.body.json) : req.body
        // users are only allowed to update themselves
        const user_data = get_user_data_from_request(req)
        console.log(user_data)
        if (user_data.user_id != req.params.id) {
            return res.sendStatus(401)
        }

        if (req.files) {
            const profileImage = req.files.file
            const imagePath = `images/${user_data.user_id}${path.extname(profileImage.name)}`
            profileImage.mv(`../frontend/public/${imagePath}`, (err) => {
                if (err) {
                    res.status(500).send({ message: "File upload failed", code: 200 });
                }
            });
            user_json['profile_image'] = imagePath
        }

        if (user_json.tutor_details) {
            user_json.tutor_details.average_rating = await reviews_DAO.get_tutor_average_rating(user_data.user_id)
            user_json.tutor_details['work_start_time'] = new Date(user_json.tutor_details.work_start_time)
            user_json.tutor_details['work_end_time'] = new Date(user_json.tutor_details.work_end_time)
        }

        let results = await users_DAO.update(req.params.id, user_json)
        return res.json(results);
    }
    else
        return res.sendStatus(401)
});

// delete
router.delete('/:id', authorize, async (req, res) => {

    // users are only allowed to delete themselves
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.params.id) {
        return res.sendStatus(401)
    }

    let results = await users_DAO.remove(req.params.id);
    res.json(results);
});


module.exports = router;
