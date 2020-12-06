const User = require("../models/user");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const mailer = require("../mailer");
const transporter = require("../mailer");
const { Op } = require("sequelize");
/**
 * Create user
 */

function addUser(req, res) {
  // add user to database
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var email = req.body.email;
  var password = req.body.password;
  if (password === undefined) {
    return res.status(403).json({
      valid: false,
      message: "Password is required",
    });
  }
  if (password.length > 16 || password.length < 8) {
    res.json({
      valid: false,
      error: "Password length should be greater than 8 lower than 16",
    });
    return;
  }

  User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: passwordHash.generate(password),
  })
    .then((response) => {
      // user added in database and we will send email to verify the account
      mailer
        .sendMail({
          from: process.env.MAIL_SENDER,
          to: email,
          subject: "Email verification",
          template: "email_verification",
          context: {
            mail: email,
            vkey: response.vkey,
            name: firstName + " " + lastName,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      // response
      res.json({
        valid: true,
        message: "User added successfuly",
        id: response.dataValues.id,
      });
    })
    .catch((err) => {
      let errMsg = [];
      err.errors.map((element) => {
        errMsg.push(element.message);
      });
      res.status(403).json({
        valid: false,
        error: errMsg,
      });
    });
}

/**
 * User login
 */

function authenticate(req, res) {
  // authenticate user
  var email = req.body.email;
  var password = req.body.password;

  var user = User.findOne({ where: { email: email } })
    .then((response) => {
      if (response !== null) {
        // user found
        if (passwordHash.verify(password, response.password)) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.roles,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({
            valid: true,
            message: "Logged in",
            token: token,
          });
        } else {
          res.status(406).json({
            valid: false,
            message: "Wrong password",
          });
        }
      } else {
        res.status(404).json({
          valid: false,
          message: "Email dose not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message,
        valid: false,
      });
    });
}

/**
 * Get user data
 */

function getUser(req, res) {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((response) => {
      if (response) {
        // user found
        delete response.dataValues.password; // remove password from object
        delete response.dataValues.vkey; // remove vkey from object
        res.status(200).json({
          valid: true,
          data: response.dataValues,
        });
      } else {
        res.status(404).json({
          valid: false,
          error: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "User error",
      });
    });
}

/**
 * Edit user is Email first name and last name
 */

function setUser(req, res) {
  const userId = req.params.id;
  // Find user before update
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        // user not in database
        res.status(404).json({
          valid: false,
          message: "User not found",
        });
      } else {
        // user in database
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;
        if (
          firstName === undefined ||
          lastName === undefined ||
          email === undefined
        ) {
          res.status(401).json({
            valid: false,
            message: "Attributes missing",
          });
        } else {
          // update user
          response.firstName = firstName;
          response.lastName = lastName;
          response.email = email;
          response
            .save()
            .then((response) => {
              // update success
              res.status(200).json({
                valid: true,
                message: "User updated",
              });
            })
            .catch((err) => {
              var errArray = [];
              err.errors.map((element) => {
                errArray.push(element.message);
              });
              res.status(403).json({
                valid: false,
                error: errArray,
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(401).json({
        valid: false,
        message: "User error",
      });
    });
}

/**
 * Change user is password
 */

function setPassword(req, res) {
  const curentPassword = req.body.password;
  const newPassword = req.body.new_password;
  const rePassword = req.body.re_password; // retyped new password
  if (
    curentPassword === undefined ||
    newPassword === undefined ||
    rePassword === undefined
  ) {
    // attrs missing
    res.status(403).json({
      valid: false,
      message: "Missing attributes",
    });
  } else {
    // check if new pass and re_pass match
    if (newPassword !== rePassword) {
      // pass dose not match
      res.status(406).json({
        valid: false,
        message: "New password and Retyped password dose not match",
      });
    } else {
      // new pass and re_pass matches
      const userId = req.params.id;
      User.findByPk(userId)
        .then((response) => {
          if (response === null) {
            res.status(404).json({
              valid: false,
              message: "User not found",
            });
          } else {
            // user found
            // validate if old pass matches saved pass
            if (passwordHash.verify(curentPassword, response.password)) {
              // send and saved pass matches
              response.password = passwordHash.generate(newPassword);
              response
                .save()
                .then((response) => {
                  res.status(200).json({
                    valid: true,
                    message: "Password changed",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    valid: false,
                    message: "Password update error",
                  });
                });
            } else {
              res.status(406).json({
                valid: false,
                message: "Password incorrect",
              });
            }
          }
        })
        .catch((err) => {});
    }
  }
}

/**
 * Reset user is password (Forget password case)
 */

function resetPassword(req, res) {
  const userId = req.params.id;
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        // user not found
        res.status(404).json({
          valid: false,
          message: "User not found",
        });
      } else {
        const newPassword = req.body.new_password;
        const rePassword = req.body.re_password;
        const passwordVkey = req.body.password_vkey;
        if (
          newPassword === undefined ||
          rePassword === undefined ||
          passwordVkey === undefined
        ) {
          // no data sent in body or some is missing
          return res.status(403).json({
            valid: false,
            message: "Attributes missing",
          });
        }
        if (newPassword !== rePassword) {
          // password and retyped password don't match
          res.status(406).json({
            valid: false,
            message: "Password and Retyped password not match",
          });
        } else {
          // valid password
          if (response.passwordVkey !== passwordVkey) {
            // Wrong validation key sent
            res.status(403).json({
              valid: false,
              message: "Invalid verification key",
            });
          } else {
            // every think is good to change password
            response.password = passwordHash.generate(newPassword); // hash new pass
            response.passwordVkey = Math.floor(100000 + Math.random() * 900000); // generate new key
            response.save();
            res.status(200).json({
              valid: true,
              message: "Password changed successfuly",
            });
          }
        }
      }
    })
    .catch((err) => {
      res.status(401).json({
        valid: false,
        message: "Reset password error",
      });
    });
}

/**
 * Delete user
 */

function deleteUser(req, res) {
  const userId = req.params.id;
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        // user not found
        res.status(404).json({
          valid: false,
          message: "User not found",
        });
      } else {
        // user found
        response.destroy().then((response) => {
          res.status(200).json({
            valid: true,
            message: "User deleted",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        error: "User Delete error",
      });
    });
}

/**
 * Get password verification key
 */

function getPasswordVkey(req, res) {
  const userId = req.params.id;
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        res.status(404).json({
          valid: false,
          message: "User not found",
        });
      } else {
        transporter
          .sendMail({
            from: process.env.MAIL_SENDER,
            to: response.email,
            subject: "Password Reset",
            template: "reset_password",
            context: {
              vkey: response.passwordVkey,
              name: response.firstName + " " + response.lastName,
            },
          })
          .then((response) => {
            res.status(200).json({
              valid: true,
              message: "Verification key sent to user email",
            });
          })
          .catch((err) => {
            /*res.status(500).json({
                            valid: false,
                            message: "Error while sending email to user"
                        })*/
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(406).json({
        valid: false,
        message: "Send password key error",
      });
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
      message: "Verification key is missing",
    });
  } else {
    // vkey sent in body
    const userId = req.params.id;
    User.findByPk(userId)
      .then((response) => {
        if (response === null) {
          // not found
          res.status(404).json({
            valid: false,
            message: "User not found",
          });
        } else {
          // user found
          // check vkey saved == vkey sent or not
          if (response.vkey === Number(vkey)) {
            // validate account by deleting the vkey from db
            response.vkey = null;
            response
              .save()
              .then((response) => {
                res.status(200).json({
                  valid: true,
                  message: "User account activated",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  valid: false,
                  message: "Set Key error",
                  err: err,
                });
              });
          } else if (response.vkey === null) {
            // already verified
            res.status(403).json({
              valid: false,
              message: "User account already verified",
            });
          } else {
            // invalid vkey sent
            res.status(406).json({
              valid: false,
              message: "Invalid verification key",
            });
          }
        }
      })
      .catch((err) => {
        res.status(500).json({
          valid: false,
          message: "User activate account error",
        });
      });
  }
}

/**
 * Add phone
 */

function addPhone(req, res) {
  const userId = req.params.id;
  const phoneNumber = Number(req.body.phone_number); // will NaN if it's not a number
  if (phoneNumber === undefined) {
    res.status(403).json({
      valid: false,
      message: "Phone number attribute is missing",
    });
  } else {
    if (isNaN(phoneNumber)) {
      res.status(403).json({
        valid: false,
        message: "Phone number must be numerical",
      });
    } else {
      User.findByPk(userId)
        .then((response) => {
          if (response === null) {
            res.status(404).json({
              valid: false,
              message: "User not found",
            });
          } else {
            response.phoneNumber = phoneNumber;
            response
              .save()
              .then((response) => {
                res.status(200).json({
                  valid: true,
                  message: "Phone added",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  valid: false,
                  message:
                    "Phone not added due to an error during the operation",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({
            valid: false,
            message: "Error",
          });
        });
    }
  }
}

/**
 * Add Bio (Description)
 */

function addBio(req, res) {
  const userId = req.params.id;
  const bio = req.body.bio;
  if (bio === undefined) {
    res.status(403).json({
      valid: false,
      message: "Bio attribute is missing",
    });
  } else {
    User.findByPk(userId)
      .then((response) => {
        if (response === null) {
          res.status(404).json({
            valid: false,
            message: "User not found",
          });
        } else {
          response.bio = bio;
          response
            .save()
            .then((response) => {
              res.status(200).json({
                valid: true,
                message: "Bio added successfuly",
              });
            })
            .catch((err) => {
              res.status(500).json({
                valid: false,
                message: "Bio not added due to an error",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({
          valid: false,
          message: "Add Bio error",
        });
      });
  }
}

/**
 * Add address and country
 */

function addAddress(req, res) {
  const userId = req.params.id;
  User.findByPk(userId)
    .then((response) => {
      if (response === null) {
        res.status(404).json({
          valid: false,
          message: "User not found",
        });
      } else {
        const address = req.body.address;
        const city = req.body.city;
        const country = req.body.country;
        var addedItems = [];
        // add value which dose not equal undifined and diffrent from the valud in database
        if (address !== undefined && response.address !== address) {
          response.address = req.body.address;
          addedItems.push("Address added");
        }
        if (country !== undefined && response.country !== country) {
          response.country = req.body.country;
          addedItems.push("Country added");
        }
        if (city !== undefined && response.city !== city) {
          response.city = req.body.city;
          addedItems.push("City added");
        }
        if (addedItems.length === 0) {
          // no data added
          res.status(202).json({
            valid: true,
            message: "No data added",
          });
        } else {
          response
            .save()
            .then((response) => {
              res.status(200).json({
                valid: true,
                message: addedItems,
              });
            })
            .catch((err) => {
              let errorMsg = [];
              err.errors.map((element) => {
                errorMsg.push(element.message);
              });
              res.status(403).json({
                valid: false,
                error: errorMsg,
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        message: "User error",
      });
    });
}

/**
 * Get all users
 */

function getUsers(req, res) {
  const username = req.query.username; // not required
  const limit = req.query.limit; // not required
  User.findAll({
    limit: Number(limit) || 1000,
    where: {
      [Op.or]: {
        firstName: {
          [Op.like]: "%" + (username || "") + "%",
        },
        lastName: {
          [Op.like]: "%" + (username || "") + "%",
        },
      },
    },
  })
    .then((response) => {
      res.status(200).json({
        valid: true,
        users: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        error: err,
      });
    });
}

module.exports = {
  addUser,
  authenticate,
  getUser,
  setUser,
  setPassword,
  getPasswordVkey,
  resetPassword,
  deleteUser,
  activateUser,
  addPhone,
  addBio,
  addAddress,
  getUsers,
};
