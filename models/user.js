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
    }
}, {
    sequelize,
    modelName: 'User'
});

//User.sync({alter: true})

module.exports = User;