const jwt = require('jsonwebtoken')

const config = require('config')
const secret_key = config.get('secret_key')

function get_token_from_request(req){
    return req.body.token || req.query.token || req.headers["x-access-token"]
}

function create_token(obj){
    return jwt.sign(obj, secret_key)
}

function verifyToken(token){
    return jwt.verify(token, secret_key)
}

function get_user_data_from_request(req){
    let token = get_token_from_request(req)
    return verifyToken(token)
}

module.exports = {
    get_user_data_from_request,
    get_token_from_request,
    create_token,
    verifyToken
}