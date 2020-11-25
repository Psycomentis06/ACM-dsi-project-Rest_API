const { DataTypes, Model } = require('sequelize');
const sequelize = require('../libs/db');
var uniqid = require('uniqid');

class User extends Model { }

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: uniqid(uniqid.time()),
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isAlpha: {
                msg: 'First name must be letters only'
            },
            len: {
                args:[3, 15],
                msg: 'First name length should be greater than 3 lower than 15'
            },
            notNull: {
                msg: 'First name is required'
            }
        }
    },
    lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isAlpha: {
                msg: 'Last name must be letters only'
            },
            len: {
                args:[3, 15],
                msg: 'Last name length should be greater than 3 lower than 15'
            },
            notNull: {
                msg: 'Last name is required'
            }
        }
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid Email format'
            },
            notNull: {
                msg: 'Email is required'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required'
            }
        }
    },
    roles: {
        type: DataTypes.STRING(15),
        defaultValue: 'ROLE_USER',
        validate: {
            isIn: {
                args: [['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']],
                msg: 'User role must be user, admin or super admin'
            }
        }
    },
    phoneNumber: {
        type: DataTypes.INTEGER,
        validate: {
            isNumeric: {
                msg: 'Phone number should be numeric'
            }
        }
    },
    address: {
        type: DataTypes.STRING(150),
        defaultValue: "empty",
        validate: {
            len: {
                args: [3, 60],
                msg: "Address length must be between 3 and 150"
            }
        }
    },
    country: {
        type: DataTypes.STRING(30),
        defaultValue: "empty",
        validate: {
            len: {
                args: [3, 30],
                msg: "Country length must be between 3 and 30"
            },
            isAlpha: {
                msg: "Country should not contain numbers"
            }
        }
    },
    city: {
        type: DataTypes.STRING(60),
        defaultValue: "empty",
        validate: {
            len: {
                args: [3, 60],
                msg: "City length must be between 3 and 60"
            },
            isAlpha: {
                msg: "City should not contain numbers"
            }
        }
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vkey: {
        type: DataTypes.INTEGER,
        defaultValue: Math.floor(100000 + Math.random() * 900000) // 6 digits
    },
    passwordVkey: {
        type: DataTypes.INTEGER,
        defaultValue: Math.floor(100000 + Math.random() * 900000)
    },
    chatRoom: {
        type: DataTypes.STRING(30),
        defaultValue: Math.floor(1000000000 + Math.random() * 9000000000) // 9 digits
    }
}, {
    sequelize,
    modelName: 'User'
});

//User.sync({alter: true})

module.exports = User;