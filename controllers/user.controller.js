var User = require('../models/user');
var passwordHash = require('password-hash');
const { response } = require('express');

function addUser(req, res) {
    // add user to database
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    /*if (firstName === undefined || lastName === undefined || email === undefined || password === undefined) {
        res.json({
            valid: false,
            error: "Required data missing"
        })
        return
    }*/

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

    User.findOne({where: {email: email}})
        .then(response => {
            if (response !== null) {
                // user found
                if (passwordHash.verify('test' + password, response.password)) {
                    res.json({
                        valid: true,
                        message: "Logged in"
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

module.exports = {
    addUser,
    authenticate
}