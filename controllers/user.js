const User = require('../models/user');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const mailer = require('../mailer');

/** 
 * Create user
 */

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
        password: passwordHash.generate(password)
    })
        .then(response => {
            // user added in database and we will send email to verify the account
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: "Email verification",
                template: 'email_verification',
                context: {
                    mail: email,
                    vkey: response.vkey,
                    name: firstName + ' ' + lastName
                }
            }).then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            })
            // response
            res.json({
                valid: true,
                message: "User added successfuly"
            })
        })
        .catch(err => {
            let errMsg = [];
            err.errors.map(element => {
                errMsg.push(element.message);
            })
            res.status(403).json({
                valid: false,
                error: errMsg
            })
        })
}

/** 
 * User login
 */

function authenticate(req, res) {
    // authenticate user
    var email = req.body.email;
    var password = req.body.password;

    var user = User.findOne({ where: { email: email } })
        .then(response => {
            if (response !== null) {
                // user found
                if (passwordHash.verify(password, response.password)) {
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

/**
 * Get user data
 */

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
            } else {
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

/**
 * Edit user is Email first name and last name
 */

function setUser(req, res) {
    const userId = req.params.id;
    // Find user before update
    User.findByPk(userId)
        .then(response => {
            if (response === null) {
                // user not in database
                res.status(404).json({
                    valid: false,
                    message: "User not found"
                });
            } else {
                // user in database
                const firstName = req.body.first_name;
                const lastName = req.body.last_name;
                const email = req.body.email;
                if (firstName === undefined || lastName === undefined || email === undefined) {
                    res.status(401).json({
                        valid: false,
                        message: "Attributes missing"
                    });
                } else {
                    // update user
                    response.firstName = firstName;
                    response.lastName = lastName;
                    response.email = email;
                    response.save()
                        .then(response => {
                            // update success
                            res.status(200).json({
                                valid: true,
                                message: 'User updated'
                            })
                        })
                        .catch(err => {
                            var errArray = [];
                            err.errors.map(element => {
                                errArray.push(element.message)
                            });
                            res.status(403).json({
                                valid: false,
                                error: errArray
                            })
                        })
                }
            }
        })
        .catch(err => {
            res.status(401).json({
                valid: false,
                message: "User error"
            })
        });
}

/** 
 * Change user is password
 */

function setPassword(req, res) {
    const curentPassword = req.body.password;
    const newPassword = req.body.new_password;
    const rePassword = req.body.re_password; // retyped new password
    if (curentPassword === undefined || newPassword === undefined || rePassword === undefined) {
        // attrs missing
        res.status(403).json({
            valid: false,
            message: "Missing attributes",
        })
    } else {
        // check if new pass and re_pass match
        if (newPassword !== rePassword) {
            // pass dose not match
            res.status(406).json({
                valid: false,
                message: "New password and Retyped password dose not match"
            })
        } else {
            // new pass and re_pass matches
            const userId = req.params.id;
            User.findByPk(userId)
                .then(response => {
                    if (response === null) {
                        res.status(404).json({
                            valid: false,
                            message: "User not found",
                        })
                    } else {
                        // user found
                        // validate if old pass matches saved pass
                        if (passwordHash.verify(curentPassword, response.password)) {
                            // send and saved pass matches
                            response.password = passwordHash.generate(newPassword);
                            response.save()
                                .then(response => {
                                    res.status(200).json({
                                        valid: true,
                                        message: "Password changed"
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        valid: false,
                                        message: "Password update error"
                                    })
                                })
                        } else {
                            res.status(406).json({
                                valid: false,
                                message: "Password incorrect"
                            })
                        }
                    }
                })
                .catch(err => {

                });
        }
    }
}

/**
 * Delete user
 */

function deleteUser(req, res) {
    const userId = req.params.id;
    User.findByPk(userId)
        .then(response => {
            if (response === null) {
                // user not found
                res.status(404).json({
                    valid: false,
                    message: "User not found"
                })
            } else {
                // user found
                response.destroy()
                    .then(response => {
                        res.status(200).json({
                            valid: true,
                            message: "User deleted"
                        })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                valid: false,
                error: "User Delete error"
            })
        });
}

/**
 * Activate account
 */

function activateUser(req, res) {
    // user account verified <=> no vkey in db
    const vkey = req.body.vkey;
    if (!vkey) {
        res.status(406).json({
            valid: false,
            message: "Verification key is missing"
        })
    } else {
        // vkey sent in body
        const userId = req.params.id;
        User.findByPk(userId)
            .then(response => {
                if (response === null) {
                    // not found
                    res.status(404).json({
                        valid: false,
                        message: "User not found"
                    })
                } else {
                    // user found
                    // check vkey saved == vkey sent or not
                    if (response.vkey === Number(vkey)) {
                        // validate account by deleting the vkey from db
                        response.vkey = null
                        response.save()
                            .then(response => {
                                res.status(200).json({
                                    valid: true,
                                    message: "User account activated"
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    valid: false,
                                    message: "Set Key error",
                                    err: err
                                })
                            });
                    } else if (response.vkey === null) {
                        // already verified
                        res.status(403).json({
                            valid: false,
                            message: "User account already verified"
                        })
                    } else {
                        // invalid vkey sent
                        res.status(406).json({
                            valid: false,
                            message: "Invalid verification key"
                        })
                    }
                }
            })
            .catch(err => {
                res.status(500).json({
                    valid: false,
                    message: "User activate account error"
                })
            })
    }
}

module.exports = {
    addUser,
    authenticate,
    getUser,
    setUser,
    setPassword,
    deleteUser,
    activateUser
}