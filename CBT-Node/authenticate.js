const jwt = require("jsonwebtoken");
const fs = require("fs");


const RSA_PRIVATE_KEY = fs.readFileSync('./rsa_key/rsa.key');
//const RSA_PUBLIC_KEY = fs.readFileSync('./rsa_key/rsa.key.pub');

function generateToken(user) {
    const jwtExp = 240;
    return token = jwt.sign({user}, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: jwtExp
    });
}

isAuthenticated = (req, res, next) => {
    let token = req.headers.authorization;
    if(!token) {
        return res.status(403).send({message: "Anauthorized, no access token ptovided!"});
    }
    jwt.verify(token, RSA_PRIVATE_KEY, (err, decoded) => {
        if(err) {
            console.log(err)
            return res.status(403).send({message: "User session expired!. Login in again"});
        }
        next();
    })    
}


module.exports = {generateToken, isAuthenticated}