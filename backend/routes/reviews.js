var express = require('express');
var router = express.Router();

const authorize = require('./middleware/authorize')
const {get_user_data_from_request} = require('./utils/token')

const reviews_DAO = require('../DAO/reviews_DAO')
const users_DAO = require('../DAO/users_DAO')

/* BEGIN HELPER FUNCTIONS */

async function update_average_rating(tutor_id){
    const new_average_rating = await reviews_DAO.get_tutor_average_rating(tutor_id)
    let tutor = await users_DAO.get(tutor_id)
    tutor.tutor_details.average_rating = new_average_rating
    await users_DAO.update(tutor_id, tutor)
}

/* BEGIN REST CRUD FUNCTIONS */

// create
router.post('/', authorize, async (req, res) => {

    // users are only allowed to create reviews where they are the student
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.body.student_id){
        return res.sendStatus(401)
    }

    let results = await reviews_DAO.insert_or_update(req.body)

    await update_average_rating(req.body.tutor_id)

    res.json(results);
})

// read_all
router.get('/', async (req, res) => {
    let results = await reviews_DAO.get_all();
    res.json(results);
});

// read all for given student
router.get('/student/:id', async (req, res) => {
    let results = await reviews_DAO.get_by_student_id(req.params.id)
    res.json(results)
})

// read all for given tutor
router.get('/tutor/:id', async (req, res) => {
    let results = await reviews_DAO.get_by_tutor_id(req.params.id)
    res.json(results)
})

// read for a given student, tutor pair
router.get('/tutor/:tutor_id/student/:student_id', async (req, res) => {
    let results = await reviews_DAO.get_by_tutor_and_student(req.params.tutor_id, req.params.student_id)
    res.json(results)
})

// read
router.get('/:id', async (req, res) => {
    let result = await reviews_DAO.get(req.params.id);
    res.json(result);
});

// update
router.put('/:id', authorize, async (req, res) => {

    // users are only allowed to update their own reviews
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != req.params.id){
        return res.sendStatus(401)
    }

    let results = await reviews_DAO.update(req.params.id, req.body)

    await update_average_rating(req.body.tutor_id)

    res.json(results);
});

// delete
router.delete('/:id', authorize, async (req, res) => {

    let existing_review = await reviews_DAO.get(req.params.id)

    // users are only allowed to delete their own reviews
    const user_data = get_user_data_from_request(req)
    if (user_data.user_id != existing_review.student_id){
        return res.sendStatus(401)
    }

    let results = await reviews_DAO.remove(req.params.id);

    await update_average_rating(existing_review.tutor_id)

    res.json(results);
});

module.exports = router;
