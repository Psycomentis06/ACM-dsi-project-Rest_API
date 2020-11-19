const User = require('../models/user');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

function addUser(req, res) {
    // add user to database
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    if (password.length > 16 || password.length < 8) {
        res.json({
            valid: false,
            error: "Password length should be greater than 8 lower than 16"
        })
        return
    }

    User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash.generate('test' + password)
    })
        .then(response => {
            res.json({
                data: response,
                valid: true,
                message: "User added successfuly"
            })
        })
        .catch(err => {
            let errMsg = [];
            err.errors.map(element => {
                errMsg.push(element.message);
            })
            res.json({
                valid: false,
                error: errMsg
            })
        })
}

function authenticate(req, res) {
    // authenticate user
    var email = req.body.email;
    var password = req.body.password;

    var user = User.findOne({where: {email: email}})
        .then(response => {
            if (response !== null) {
                // user found
                if (passwordHash.verify('test' + password, response.password)) {
                    const token = jwt.sign({
                        id: user.id,
                        email: user.email,
                        role: user.roles
                    }, process.env.JWT_KEY, {
                        expiresIn: '1h'
                    })
                    res.json({
                        valid: true,
                        message: "Logged in",
                        token: token
                    })
                } else {
                    res.json({
                        valid: false,
                        message: "Wrong password"
                    })
                }
            } else {
                res.json({
                    valid: false,
                    message: "Email dose not exist"
                })
            }
        })
        .catch(err => {
            res.json({
                err: err.message,
                valid: false
            })
        })
}

function getUser(req, res) {
    const userId = req.params.id;

    User.findByPk(userId)
    .then(response => {
        if (response) {
            // user found
            delete response.dataValues.password; // remove password from object
            delete response.dataValues.vkey; // remove vkey from object
            res.status(200).json({
                valid: true,
                data: response.dataValues
            });
        }else {
            res.status(404).json({
                valid: false,
                error: 'User not found'
            })
        }
    })
    .catch(err => {
        res.status(404).json({
            valid: false,
            error: 'User error'
        })
    })
}

function editUser(req, res) {

}

module.exports = {
    addUser,
    authenticate,
    getUser
}