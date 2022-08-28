const token_utils = require('../utils/token')

const authorize = (req, res, next) => {
    let token = token_utils.get_token_from_request(req)

    if (!token){
        return res.send('Token is required for authentication');
    }
    
    try{
        const decoded = token_utils.verifyToken(token)
        console.log(decoded);
        return next()
    }
    catch(err){
        return res.send(err);
    }
}

module.exports = authorize